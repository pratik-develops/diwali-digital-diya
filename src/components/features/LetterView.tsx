"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { decodePayload } from "@/lib/payload";
import type { LetterPayload } from "@/lib/types";

export function LetterView() {
  const { t, play } = useApp();
  const params = useSearchParams();
  const payload = decodePayload<LetterPayload>(params.get("d"));
  const [open, setOpen] = useState(false);
  const valid =
    payload &&
    payload.v === 1 &&
    typeof payload.message === "string";

  if (!valid) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-lg">{t.invalidLetter}</p>
        <Link href="/#letter" className="btn-gold mt-6">
          {t.createOwn}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="envelope"
            type="button"
            className="relative mx-auto block h-48 w-72"
            onClick={() => {
              setOpen(true);
              play("open");
            }}
            initial={{ y: 12 }}
            animate={{ y: [12, 0, 12] }}
            transition={{ repeat: Infinity, duration: 2.6 }}
            aria-label={t.openLetter}
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#5a1028] to-burgundy shadow-2xl" />
            <span className="absolute inset-x-0 top-0 h-24 origin-top rounded-t-2xl bg-gold/90 [clip-path:polygon(0_0,100%_0,50%_100%)]" />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold text-night">
              {t.openLetter}
            </span>
          </motion.button>
        ) : (
          <motion.article
            key="letter"
            className="festive-card rounded-[2rem] p-8 text-left"
            initial={{ rotateX: 80, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
          >
            <p className="text-xs tracking-[0.3em] text-gold uppercase">For {payload.to}</p>
            <p className="mt-6 whitespace-pre-wrap text-lg leading-relaxed">{payload.message}</p>
            <p className="mt-8 italic">— {payload.from}</p>
          </motion.article>
        )}
      </AnimatePresence>
      <Link href="/#letter" className="btn-ghost mt-8">
        {t.createOwn}
      </Link>
    </div>
  );
}
