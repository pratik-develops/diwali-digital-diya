"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
};

const COLORS = ["#ffd56a", "#ff8a1e", "#ff6b9d", "#7ad1c4", "#c084fc", "#fff7e8", "#0f8a55"];

export function FireworksCanvas({ burstKey }: { burstKey: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const tick = () => {
      ctx.fillStyle = "rgba(12, 1, 8, 0.18)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.current = particles.current.filter((particle) => particle.life > 0);
      particles.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.04;
        particle.life -= 1;
        ctx.globalAlpha = Math.max(particle.life / 80, 0);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!burstKey) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    for (let burst = 0; burst < 4; burst += 1) {
      const x = 80 + Math.random() * (canvas.offsetWidth - 160);
      const y = 50 + Math.random() * (canvas.offsetHeight * 0.45);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < 55; i += 1) {
        const angle = (Math.PI * 2 * i) / 55;
        const speed = 1.2 + Math.random() * 2.8;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 70 + Math.random() * 30,
          color,
          size: 1.4 + Math.random() * 2,
        });
      }
    }
  }, [burstKey]);

  return (
    <canvas
      ref={canvasRef}
      className="h-[380px] w-full rounded-[2rem] bg-[#0c0108]"
      aria-label="Fireworks night sky"
    />
  );
}
