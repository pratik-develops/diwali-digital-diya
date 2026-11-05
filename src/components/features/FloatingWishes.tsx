"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";
import { useStoredJson } from "@/lib/storage";
import type { Wish } from "@/lib/types";

const DEMO: Wish[] = [
  {
    id: "demo-1",
    name: "Lapiz",
    text: "May every home keep a small brave light.",
    createdAt: 1,
  },
];

export function FloatingWishes() {
  const { t, play } = useApp();
  const [wishes, setWishes] = useStoredJson<Wish[]>("diya-wishes", DEMO);
  const [text, setText] = useState("");
  const [name, setName] = useState("");

  const release = () => {
    const nextText = text.trim();
    if (!nextText) return;
    const wish: Wish = {
      id: `${Date.now()}`,
      text: nextText.slice(0, 140),
      name: name.trim() || "Anonymous",
      createdAt: Date.now(),
    };
    const next = [...wishes, wish].slice(-24);
    setWishes(next);
    setText("");
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
          onChange={(e) => setText(e.target.value)}
        />
        <label htmlFor="wish-name">{t.yourName}</label>
        <input id="wish-name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="btn-gold w-full">
          {t.releaseWish}
        </button>
      </form>
      <div className="relative min-h-80 overflow-hidden rounded-[2rem] bg-[#0a0108]/70 p-4">
        {wishes.length === 0 ? (
          <p className="flex h-80 items-center justify-center text-amber-100/70">
            {t.emptyWishes}
          </p>
        ) : (
          wishes.map((wish, index) => (
            <motion.article
              key={wish.id}
              className="lantern-float absolute max-w-40 rounded-2xl bg-gradient-to-b from-amber-200 to-orange-500 px-3 py-3 text-night shadow-lg"
              style={{
                left: `${(index * 13) % 82}%`,
                bottom: `${12 + (index % 5) * 12}%`,
                animationDelay: `${index * 0.2}s`,
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <p className="text-xs font-bold">🏮 {wish.name}</p>
              <p className="mt-1 text-xs leading-snug">{wish.text}</p>
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
}
