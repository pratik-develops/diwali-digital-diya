"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Gift } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";
import { blessings } from "@/lib/greetings";

export function MysteryGift() {
  const { t, language, play } = useApp();
  const [open, setOpen] = useState(false);
  const [blessing, setBlessing] = useState("");

  const unwrap = () => {
    const list = blessings[language];
    setBlessing(list[Math.floor(Math.random() * list.length)]);
    setOpen(true);
    play("gift");
  };

  return (
    <section id="gift" className="mx-auto max-w-3xl px-4 py-20 text-center">
      <SectionHeading kicker="Surprise" title={t.giftTitle} lead={t.giftLead} />
      <div className="relative mx-auto flex h-64 items-center justify-center">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.button
              key="box"
              type="button"
              className="relative"
              onClick={unwrap}
              initial={{ rotate: -6 }}
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
              aria-label={t.openGift}
            >
              <div className="h-36 w-44 rounded-2xl bg-gradient-to-br from-burgundy to-plum shadow-2xl" />
              <div className="absolute left-1/2 top-0 h-36 w-6 -translate-x-1/2 bg-gold" />
              <div className="absolute left-0 top-10 h-6 w-44 bg-gold" />
              <Gift className="absolute -top-6 left-1/2 -translate-x-1/2 text-gold" />
            </motion.button>
          ) : (
            <motion.div
              key="gift"
              className="festive-card max-w-lg rounded-[2rem] p-8"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <p className="text-sm tracking-[0.3em] text-gold uppercase">Blessing</p>
              <p className="mt-4 text-xl leading-relaxed">{blessing}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button type="button" className="btn-gold mt-4" onClick={unwrap}>
        {open ? t.anotherGift : t.openGift}
      </button>
    </section>
  );
}
