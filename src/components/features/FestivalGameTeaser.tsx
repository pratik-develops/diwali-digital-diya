"use client";

import Link from "next/link";
import { ArrowRight, Flame, Shield, Sparkles, Trophy, Zap } from "lucide-react";
import { useApp } from "@/components/providers/AppProviders";

export function FestivalGameTeaser() {
  const { t } = useApp();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <div className="festive-card relative overflow-hidden rounded-[2rem] p-6 sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-saffron/10 blur-3xl"
        />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.22em] text-gold uppercase">
              <Sparkles size={15} /> Festival arcade adventure
            </p>
            <h2 className="font-display mt-3 text-3xl text-amber-50 sm:text-4xl">
              {t.gameTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-amber-100/75 sm:text-base">
              {t.gameLead}
            </p>
            <Link href="/game" className="btn-gold mt-6">
              <Flame size={17} /> {t.gameEntry} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Shield size={19} />, label: "Protect the kingdom" },
              { icon: <Zap size={19} />, label: "Unlock light powers" },
              { icon: <Trophy size={19} />, label: "Chase a high score" },
              { icon: <Sparkles size={19} />, label: "Challenge a friend" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-h-20 flex-col justify-between rounded-2xl border border-gold/15 bg-white/[0.035] p-4 text-amber-50/90"
              >
                <span className="text-gold">{item.icon}</span>
                <span className="text-xs font-bold sm:text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
