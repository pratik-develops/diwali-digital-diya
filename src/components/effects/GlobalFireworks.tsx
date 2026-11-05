"use client";

import { useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useApp } from "@/components/providers/AppProviders";
import {
  disposeFireworkSound,
  playFireworkSound,
} from "@/lib/audio";

type Particle = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

const COLORS = ["#ffd56a", "#ff8a1e", "#ff6b9d", "#c084fc", "#67d5e8", "#50c878"];
const MAX_PARTICLES = 620;
const COOLDOWN_MS = 140;
const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, select, option, label, summary, form, fieldset, canvas, video, audio, " +
  "[role], [contenteditable='true'], [data-fireworks-ignore], " +
  "[tabindex]:not([tabindex='-1'])";

export function GlobalFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fxOn, toggleFx, t } = useApp();
  const soundEnabledRef = useRef(fxOn);

  useEffect(() => {
    soundEnabledRef.current = fxOn;
  }, [fxOn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const particles: Particle[] = [];
    let frame = 0;
    let lastBurstAt = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const animate = () => {
      context.globalCompositeOperation = "destination-out";
      context.fillStyle = "rgba(0, 0, 0, 0.18)";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.previousX = particle.x;
        particle.previousY = particle.y;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.985;
        particle.vy = particle.vy * 0.985 + 0.035;
        particle.life -= 1;

        if (particle.life <= 0) {
          particles.splice(index, 1);
          continue;
        }

        const opacity = Math.min(1, particle.life / (particle.maxLife * 0.3));
        context.globalAlpha = opacity;
        context.strokeStyle = particle.color;
        context.lineWidth = particle.size;
        context.shadowBlur = particle.size * 5;
        context.shadowColor = particle.color;
        context.beginPath();
        context.moveTo(particle.previousX, particle.previousY);
        context.lineTo(particle.x, particle.y);
        context.stroke();
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      if (particles.length) {
        frame = window.requestAnimationFrame(animate);
      } else {
        context.clearRect(0, 0, width, height);
        frame = 0;
      }
    };

    const burst = (x: number, y: number) => {
      const count = 48 + Math.floor(Math.random() * 25);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const pattern = Math.floor(Math.random() * 3);
      const offset = Math.random() * Math.PI * 2;

      for (let index = 0; index < count; index += 1) {
        const angle =
          offset +
          (index / count) * Math.PI * 2 +
          (pattern === 1 ? (Math.random() - 0.5) * 0.12 : 0);
        const speed =
          (pattern === 2 ? 1.8 + Math.random() * 2.2 : 2.2 + Math.random() * 4.1) *
          (pattern === 1 ? 0.84 + Math.random() * 0.28 : 1);
        const life = 45 + Math.random() * 35;
        particles.push({
          x,
          y,
          previousX: x,
          previousY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          color: Math.random() < 0.72 ? color : COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 0.8 + Math.random() * 1.8,
        });
      }

      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const target = event.target;
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) return;

      const now = performance.now();
      if (now - lastBurstAt < COOLDOWN_MS) return;
      lastBurstAt = now;
      burst(event.clientX, event.clientY);
      if (soundEnabledRef.current) playFireworkSound();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerdown", onPointerDown);
      if (frame) window.cancelAnimationFrame(frame);
      particles.length = 0;
      context.clearRect(0, 0, width, height);
      disposeFireworkSound();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
        aria-hidden="true"
      />
      <button
        type="button"
        className="fixed bottom-5 right-5 z-[60] inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-[#16030f]/90 text-gold shadow-lg shadow-black/30 backdrop-blur-md transition hover:scale-105 hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        onClick={toggleFx}
        aria-pressed={fxOn}
        aria-label={fxOn ? t.mute : t.unmute}
        title={fxOn ? t.mute : t.unmute}
        data-fireworks-ignore
      >
        {fxOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
}
