"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Settings2, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useApp } from "@/components/providers/AppProviders";
import { useStoredJson } from "@/lib/storage";
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

const subscribeToHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function GlobalFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    fxOn,
    toggleFx,
    touchAnimationsOn,
    setTouchAnimations,
    t,
  } = useApp();
  const soundEnabledRef = useRef(fxOn);
  const touchAnimationsEnabledRef = useRef(touchAnimationsOn);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [welcomeDismissed, setWelcomeDismissed] = useStoredJson(
    "diya-touch-welcome-dismissed-v3",
    false,
  );
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );
  const reduceMotion = useReducedMotion();
  const showWelcome = hydrated && !welcomeDismissed && !touchAnimationsOn;

  const dismissWelcome = () => setWelcomeDismissed(true);
  const showTouchToast = (nextEnabled: boolean) => {
    setToastMessage(
      nextEnabled
        ? "🎆 Touch Animations are ON! Tap anywhere to enjoy the magic of Diwali."
        : "✨ Touch Animations are OFF. Enjoy a smoother browsing experience! Turn them ON anytime to experience the festive magic.",
    );
  };
  const enableTouchAnimations = () => {
    setTouchAnimations(true);
    showTouchToast(true);
    setWelcomeDismissed(true);
  };

  useEffect(() => {
    if (!toastMessage) return;

    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 3600);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    soundEnabledRef.current = fxOn;
  }, [fxOn]);

  useEffect(() => {
    touchAnimationsEnabledRef.current = touchAnimationsOn;
  }, [touchAnimationsOn]);

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
      if (!touchAnimationsEnabledRef.current) return;
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
      <div className="fixed bottom-5 right-[4.5rem] z-[60]" data-fireworks-ignore>
        <div
          id="touch-animation-settings"
          hidden={!settingsOpen}
          className="absolute bottom-14 right-0 w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-gold/30 bg-[#16030f]/95 p-4 text-amber-50 shadow-xl shadow-black/40 backdrop-blur-xl"
        >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gold">Touch Animations</p>
                <p className="mt-1 text-xs leading-5 text-amber-100/70">
                  Controls fireworks triggered by touching or clicking the background.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={touchAnimationsOn}
                aria-label={`Touch Animations ${touchAnimationsOn ? "ON" : "OFF"}`}
                onClick={() => {
                  const nextEnabled = !touchAnimationsOn;
                  setTouchAnimations(nextEnabled);
                  showTouchToast(nextEnabled);
                }}
                className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  touchAnimationsOn
                    ? "border-gold/70 bg-gold/35"
                    : "border-white/20 bg-white/10"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-gold shadow transition-transform ${
                    touchAnimationsOn ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-gold/20 bg-white/5 px-3 py-2">
              <div className="flex items-center gap-2 text-[0.64rem] uppercase tracking-[0.18em] text-amber-100/70">
                <Sparkles size={12} className={touchAnimationsOn ? "text-gold" : "text-amber-100/60"} />
                <span>Status</span>
              </div>
              <span
                className={`rounded-full border px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${
                  touchAnimationsOn
                    ? "border-gold/50 bg-gold/15 text-gold"
                    : "border-white/15 bg-white/5 text-amber-100/75"
                }`}
              >
                {touchAnimationsOn ? "ON" : "OFF"}
              </span>
            </div>
        </div>
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-[#16030f]/90 text-gold shadow-lg shadow-black/30 backdrop-blur-md transition hover:scale-105 hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          onClick={() => setSettingsOpen((open) => !open)}
          aria-expanded={settingsOpen}
          aria-controls="touch-animation-settings"
          aria-label="Open animation settings"
          title="Animation settings"
        >
          <Settings2 size={20} />
        </button>
      </div>
      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            key={toastMessage}
            role="status"
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
            className="pointer-events-none fixed left-1/2 top-[5.25rem] z-[70] w-[min(92vw,32rem)] -translate-x-1/2 rounded-[1.3rem] border border-gold/40 bg-[radial-gradient(circle_at_top,rgba(255,190,95,0.18),transparent_55%),linear-gradient(135deg,rgba(72,10,35,0.98),rgba(24,6,17,0.94))] px-4 py-3 text-center text-sm font-medium text-amber-50 shadow-2xl shadow-black/40 backdrop-blur-xl sm:top-20"
            data-fireworks-ignore
          >
            <span className="inline-block max-w-full text-[0.76rem] leading-relaxed text-amber-50/90 sm:text-sm">
              {toastMessage}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {showWelcome && (
        <div className="pointer-events-none fixed inset-x-0 top-[5.25rem] z-[70] flex justify-center px-3 sm:top-20">
          <motion.aside
            aria-label="Touch fireworks welcome"
            className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-[1.6rem] border border-gold/35 bg-[radial-gradient(ellipse_at_top_right,rgba(255,177,71,.18),transparent_52%),linear-gradient(145deg,rgba(74,13,48,.97),rgba(22,3,15,.97))] p-4 text-amber-50 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5"
            initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
            data-fireworks-ignore
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-3 -top-4 text-gold/20">
              <Sparkles size={76} strokeWidth={1} />
            </div>
            <button
              type="button"
              onClick={dismissWelcome}
              aria-label="Close welcome popup"
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-amber-100/65 transition hover:bg-white/10 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <X size={17} />
            </button>
            <p className="relative max-w-[calc(100%-1.5rem)] pr-2 font-display text-base leading-snug text-gold sm:text-lg">
              ✨ Bring Diwali to Life!
            </p>
            <p className="relative mt-2 max-w-[34rem] pr-1 text-xs leading-5 text-amber-100/80 sm:text-sm">
              Want to experience a little more Diwali magic? Turn ON Touch Animations and tap anywhere to light up the night with festive fireworks!
            </p>
            <div className="relative mt-4">
              <button
                type="button"
                onClick={enableTouchAnimations}
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-gold/55 bg-gradient-to-b from-[#ffe08a] to-[#ff9a35] px-4 py-2 text-xs font-extrabold text-[#3a1408] shadow-lg shadow-orange-950/25 transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto sm:text-sm"
              >
                Enable Touch Animations
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </>
  );
}
