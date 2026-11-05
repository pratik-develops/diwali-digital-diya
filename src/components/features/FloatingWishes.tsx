"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";
import { useStoredJson } from "@/lib/storage";
import type { Wish, WishLantern } from "@/lib/types";

type LanternFlight = {
  id: string;
  wish: Wish;
  image: WishLantern;
  left: number;
  duration: number;
  sway: number;
  delay: number;
};

const RED_LANTERN: WishLantern = "/illustrations/wishes-lantern.png";
const SKY_LANTERN: WishLantern = "/illustrations/wishes-sky-lantern.png";

const DEMO: Wish[] = [
  {
    id: "demo-1",
    name: "Lapiz",
    text: "May every home keep a small brave light.",
    createdAt: 1,
  },
];

function lanternForWish(wish: Wish, index: number): WishLantern {
  if (wish.lantern === RED_LANTERN || wish.lantern === SKY_LANTERN) {
    return wish.lantern;
  }
  return index % 2 === 0 ? RED_LANTERN : SKY_LANTERN;
}

export function FloatingWishes() {
  const { t, play } = useApp();
  const [wishes, setWishes] = useStoredJson<Wish[]>("diya-wishes", DEMO);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [lanterns, setLanterns] = useState<LanternFlight[]>([]);
  const lanternOrderRef = useRef(0);
  const nextLanternPairRef = useRef<WishLantern[]>([]);

  const release = () => {
    if (!text.trim()) return;

    if (nextLanternPairRef.current.length === 0) {
      nextLanternPairRef.current =
        Math.random() < 0.5
          ? [RED_LANTERN, SKY_LANTERN]
          : [SKY_LANTERN, RED_LANTERN];
    }
    const lantern = nextLanternPairRef.current.shift() ?? RED_LANTERN;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const order = lanternOrderRef.current++;
    const left = 14 + ((order * 29 + Math.random() * 18) % 66);
    const wish: Wish = {
      id,
      text,
      name: name.trim() || "Anonymous",
      createdAt: Date.now(),
      lantern,
    };

    setWishes((previous) => [...previous, wish].slice(-24));
    setLanterns((current) => [
      ...current,
      {
        id: `${id}-flight`,
        wish,
        image: lantern,
        left,
        duration: 7.4 + Math.random() * 1.8,
        sway: 10 + Math.random() * 12,
        delay: Math.random() * 0.25,
      },
    ]);
    setText("");
    setName("");
    setSelectedWish(null);
    play("wish");
  };

  return (
    <section id="wishes" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        kicker="Night lanterns"
        title="Wishes That Take Flight"
        lead="Write a Diwali wish and release it as a glowing lantern into the night."
      />
      <p className="mx-auto mb-8 max-w-3xl text-center text-sm text-amber-100/70">
        {t.wishesNote}
      </p>
      <form
        className="festive-card mx-auto mb-10 max-w-xl space-y-3 rounded-[2rem] p-6"
        onSubmit={(event) => {
          event.preventDefault();
          release();
        }}
      >
        <label htmlFor="wish">{t.message}</label>
        <textarea
          id="wish"
          rows={3}
          maxLength={140}
          placeholder={t.wishPlaceholder}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <label htmlFor="wish-name">{t.yourName}</label>
        <input
          id="wish-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit" className="btn-gold w-full" disabled={!text.trim()}>
          {t.releaseWish}
        </button>
      </form>

      <div className="relative isolate min-h-[28rem] overflow-hidden rounded-[2rem] border border-gold/20 bg-[radial-gradient(ellipse_at_50%_100%,rgba(244,156,62,.2),transparent_48%),linear-gradient(180deg,#100b21,#090511_70%)] p-4 sm:p-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((star) => (
            <span
              key={star}
              className="absolute h-1 w-1 rounded-full bg-amber-100/70 shadow-[0_0_8px_rgba(255,215,120,.8)]"
              style={{
                left: `${(star * 47 + 13) % 97}%`,
                top: `${(star * 31 + 9) % 80}%`,
                opacity: 0.3 + (star % 4) * 0.14,
              }}
            />
          ))}
        </div>

        {lanterns.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-amber-100/55">
            {t.emptyWishes}
          </p>
        )}

        <AnimatePresence>
          {lanterns.map((lantern) => (
            <motion.button
              key={lantern.id}
              type="button"
              aria-label={`Read ${lantern.wish.name}'s wish`}
              onClick={() => setSelectedWish(lantern.wish)}
              onAnimationComplete={() => {
                setLanterns((current) => current.filter((item) => item.id !== lantern.id));
              }}
              initial={{ y: 0, x: 0, opacity: 0, scale: 0.72, rotate: -4 }}
              animate={{
                y: [0, -120, -290, -530],
                x: [0, lantern.sway, -lantern.sway, lantern.sway * 0.55],
                opacity: [0, 1, 1, 0],
                scale: [0.72, 1, 0.88, 0.48],
                rotate: [-4, 3, -2, 2],
              }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{
                duration: lantern.duration,
                delay: lantern.delay,
                ease: "linear",
                times: [0, 0.22, 0.7, 1],
              }}
              className="absolute bottom-[-1rem] z-[1] flex w-40 -translate-x-1/2 touch-manipulation flex-col items-center border-0 bg-transparent p-0 drop-shadow-[0_0_22px_rgba(255,186,91,.58)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:w-48"
              style={{ left: `${lantern.left}%` }}
            >
              <span className="relative block h-24 w-full shrink-0 sm:h-28">
                <Image
                  src={lantern.image}
                  alt=""
                  fill
                  sizes="192px"
                  className="object-contain"
                  priority={false}
                />
              </span>
              <span className="mt-1 block w-full rounded-2xl border border-gold/25 bg-[#170e20]/85 px-3 py-2 text-center shadow-[0_0_18px_rgba(255,186,91,.16)] backdrop-blur-sm">
                <span className="block truncate text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold/80">
                  {lantern.wish.name}
                </span>
                <span className="mt-1 block whitespace-pre-wrap break-words text-xs leading-4 text-amber-50 [overflow-wrap:anywhere]">
                  {lantern.wish.text}
                </span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>

        {selectedWish && (
          <motion.aside
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 z-10 max-w-[min(22rem,calc(100%-2rem))] rounded-[1.6rem] border border-gold/30 bg-[#1b0710]/95 p-4 shadow-xl backdrop-blur-md"
          >
            <button
              type="button"
              aria-label="Close wish"
              onClick={() => setSelectedWish(null)}
              className="absolute right-3 top-3 rounded-full p-1 text-amber-100/60 hover:bg-white/10 hover:text-gold"
            >
              <X size={16} />
            </button>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.26em] text-gold/80">
              Lantern message
            </p>
            <p className="mt-2 text-lg font-display text-amber-50">{selectedWish.name}</p>
            <p className="mt-2 text-sm leading-6 text-amber-100/80">“{selectedWish.text}”</p>
          </motion.aside>
        )}
      </div>

      {wishes.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold/70">Your saved wishes</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {wishes.map((wish, index) => {
              const image = lanternForWish(wish, index);
              return (
                <button
                  key={wish.id}
                  type="button"
                  onClick={() => setSelectedWish(wish)}
                  className="flex min-w-48 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-gold/40 hover:bg-white/[0.07]"
                >
                  <span className="relative h-12 w-12 shrink-0">
                    <Image src={image} alt="" fill sizes="40px" className="object-contain" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-amber-50">{wish.name}</span>
                    <span className="mt-1 block max-w-40 truncate text-xs text-amber-100/60">{wish.text}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
