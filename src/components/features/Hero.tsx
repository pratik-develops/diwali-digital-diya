"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Diya } from "@/components/ui/Diya";
import { useApp } from "@/components/providers/AppProviders";

export function Hero() {
  const { t } = useApp();
  return (
    <section
      id="welcome"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-10"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="lantern-float absolute left-[8%] top-[18%] text-4xl">🏮</div>
        <div className="lantern-float absolute right-[12%] top-[22%] text-5xl" style={{ animationDelay: "1.2s" }}>
          🏮
        </div>
        <div className="absolute bottom-10 left-1/2 h-40 w-[28rem] -translate-x-1/2 rounded-full bg-saffron/20 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-5xl text-center"
      >
        <p className="mb-4 text-xs font-bold tracking-[0.32em] text-gold uppercase sm:tracking-[0.4em]">
          Festival of Lights
        </p>
        <h1 className="font-display gold-text text-4xl leading-tight sm:text-6xl lg:text-7xl">
          {t.brand}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-amber-100/85 sm:text-2xl">
          {t.tagline}
        </p>
        <motion.div
          className="mt-8 flex items-end justify-center gap-2 sm:gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.16, delayChildren: 0.24 } },
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}>
          <Diya lit size={78} />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}>
          <Diya lit size={108} />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}>
          <Diya lit size={78} />
          </motion.div>
        </motion.div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <motion.a
            href="#greet"
            className="btn-gold"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles size={18} />
            {t.enter}
          </motion.a>
          <Link href="/game" className="btn-ghost border-gold/45 px-5 py-3 text-gold">
            <Sparkles size={17} />
            {t.nav.game}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
