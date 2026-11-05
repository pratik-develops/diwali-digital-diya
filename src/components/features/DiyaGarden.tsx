"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Diya } from "@/components/ui/Diya";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";

const COUNT = 18;

export function DiyaGarden() {
  const { t, play } = useApp();
  const [lit, setLit] = useState<boolean[]>(() => Array(COUNT).fill(false));
  const glowing = lit.filter(Boolean).length;
  const glow = useMemo(() => Math.min(glowing / COUNT, 1), [glowing]);

  const toggle = (index: number) => {
    setLit((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      if (next[index]) play("diya");
      return next;
    });
  };

  return (
    <section id="garden" className="relative px-4 py-20">
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 70%, rgba(255, 138, 30, ${0.08 + glow * 0.28}), transparent 55%)`,
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          kicker="Courtyard"
          title="Light Up the Courtyard"
          lead="Click each diya to light it. Watch the courtyard glow as more flames rise."
        />
        <p className="mb-6 text-center text-gold">
          {glowing} {t.litCount}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-gold" onClick={() => {
            setLit(Array(COUNT).fill(true));
            play("diya");
          }}>
            {t.lightAll}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setLit(Array(COUNT).fill(false))}>
            {t.extinguish}
          </button>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {lit.map((isLit, index) => (
            <motion.div
              key={index}
              animate={isLit ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              className="flex justify-center"
            >
              <Diya
                lit={isLit}
                size={index % 5 === 0 ? 92 : 76}
                onClick={() => toggle(index)}
                label={isLit ? "Extinguish diya" : "Light diya"}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
