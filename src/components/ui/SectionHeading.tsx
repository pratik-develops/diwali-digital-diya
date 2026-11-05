"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SectionHeading({
  kicker,
  title,
  lead,
}: {
  kicker?: string;
  title: string;
  lead?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.header
      className="mx-auto mb-8 max-w-3xl text-center"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
    >
      {kicker ? (
        <p className="mb-2 text-xs font-bold tracking-[0.28em] text-gold uppercase">
          {kicker}
        </p>
      ) : null}
      <h2 className="font-display gold-text text-3xl leading-tight sm:text-5xl">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-base text-amber-100/80 sm:text-lg">{lead}</p>
      ) : null}
    </motion.header>
  );
}
