"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { FireworksCanvas } from "@/components/effects/FireworksCanvas";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";

export function FireworksCelebration() {
  const { t, play } = useApp();
  const [burst, setBurst] = useState(0);

  return (
    <section id="fireworks" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        kicker="Night sky"
        title="Paint the Night with Light"
        lead="Celebrate Diwali by filling the night sky with spectacular fireworks."
      />
      <div className="festive-card overflow-hidden rounded-[2rem] p-3">
        <FireworksCanvas burstKey={burst} />
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="btn-gold"
          onClick={() => {
            setBurst((value) => value + 1);
            play("firework");
          }}
        >
          <Sparkles size={18} /> {t.celebrate}
        </button>
      </div>
    </section>
  );
}
