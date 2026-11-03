"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { stories } from "@/lib/stories";
import { useApp } from "@/components/providers/AppProviders";

const storyIllustrations = {
  rama: {
    src: "/illustrations/rama-ayodhya.svg",
    alt: "Ayodhya glowing with rows of lamps beneath a moonlit sky",
  },
  kali: {
    src: "/illustrations/maa-kali.svg",
    alt: "A devotional portrait of Maa Kali surrounded by a golden halo and lamps",
  },
  diya: {
    src: "/illustrations/diya-light.svg",
    alt: "A glowing earthen diya surrounded by light, flowers, and stars",
  },
} as const;

export function JourneyBook() {
  const { t, play } = useApp();
  const scenes = useMemo(
    () =>
      stories.flatMap((story) =>
        story.scenes.map((scene) => ({
          ...scene,
          storyId: story.id,
        })),
      ),
    [],
  );
  const [index, setIndex] = useState(0);
  const scene = scenes[index];
  const illustration = storyIllustrations[scene.storyId as keyof typeof storyIllustrations];
  const progress = ((index + 1) / scenes.length) * 100;

  const go = (next: number) => {
    setIndex(Math.min(Math.max(next, 0), scenes.length - 1));
    play("open");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="mb-2 text-center text-xs tracking-[0.3em] text-gold uppercase">
        {t.journeyTitle}
      </p>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden>
        <div className="h-full bg-gradient-to-r from-saffron to-gold" style={{ width: `${progress}%` }} />
      </div>
      <p className="sr-only">
        Scene {index + 1} of {scenes.length}
      </p>
      <AnimatePresence mode="wait">
        <motion.article
          key={scene.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="festive-card overflow-hidden rounded-[2rem]"
        >
          <motion.div
            className="relative aspect-[16/9] overflow-hidden bg-night"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            <Image
              src={illustration.src}
              alt={illustration.alt}
              width={1600}
              height={900}
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 896px"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="p-6 sm:p-10">
            <p className="text-xs tracking-[0.25em] text-gold uppercase">{scene.kicker}</p>
            <h1 className="font-display mt-3 text-3xl text-gold sm:text-5xl">{scene.title}</h1>
            <p className="mt-5 text-base leading-relaxed text-amber-50/90 sm:text-lg">{scene.body}</p>
          </div>
        </motion.article>
      </AnimatePresence>
      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={() => go(index - 1)} disabled={index === 0}>
          <ChevronLeft size={16} /> Previous
        </button>
        <p className="text-sm text-amber-100/70">
          {index + 1} / {scenes.length}
        </p>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => go(index + 1)}
          disabled={index === scenes.length - 1}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/" className="btn-gold">
          {t.brand}
        </Link>
      </div>
    </div>
  );
}
