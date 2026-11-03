"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";
import { stories } from "@/lib/stories";

export function JourneyTeaser() {
  const { t } = useApp();
  return (
    <section id="journey-home" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading kicker="Signature storybook" title={t.journeyTitle} lead={t.journeyLead} />
      <div className="grid gap-4 md:grid-cols-3">
        {stories.map((story) => (
          <article key={story.id} className="festive-card rounded-[2rem] p-6">
            <p className="text-xs tracking-[0.25em] text-gold uppercase">{story.subtitle}</p>
            <h3 className="font-display mt-3 text-2xl">{story.title}</h3>
            <p className="mt-3 line-clamp-4 text-sm text-amber-100/75">
              {story.scenes[0].body}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/journey" className="btn-gold">
          <BookOpen size={18} /> {t.openJourney}
        </Link>
      </div>
    </section>
  );
}
