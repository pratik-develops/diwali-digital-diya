"use client";

import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { GreetingCard } from "@/components/cards/GreetingCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";
import { composeGreeting } from "@/lib/greetings";
import { downloadNodePng } from "@/lib/download";
import type { CardFont, CardTemplate, GreetingPayload } from "@/lib/types";

const templates: CardTemplate[] = ["royal", "marigold", "peacock", "night"];
const fonts: CardFont[] = ["display", "elegant", "playful"];
const accents = ["#fff7e8", "#ffd56a", "#7ad1c4", "#ffb6c8"];
const stickerSets = [
  ["🪔", "✨", "🌸"],
  ["🎆", "💛", "🪷"],
  ["🌙", "⭐", "🪔"],
  ["🌺", "🕯️", "💫"],
];

export function CardStudio() {
  const { t, language } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);
  const [from, setFrom] = useState("Pratik");
  const [to, setTo] = useState("Friends");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState<CardTemplate>("marigold");
  const [font, setFont] = useState<CardFont>("display");
  const [accent, setAccent] = useState(accents[0]);
  const [stickers, setStickers] = useState(stickerSets[0]);
  const [status, setStatus] = useState("");

  const payload: GreetingPayload = {
    v: 1,
    from,
    to,
    language,
    style: "elegant",
    template,
    font,
    accent,
    stickers,
    message: composeGreeting({
      from,
      to,
      language,
      style: "elegant",
      template,
      message,
    }),
  };

  return (
    <section id="studio" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading kicker="Design desk" title={t.studioTitle} lead={t.studioLead} />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="festive-card space-y-4 rounded-[2rem] p-6">
          <div>
            <label htmlFor="st-from">{t.from}</label>
            <input id="st-from" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label htmlFor="st-to">{t.to}</label>
            <input id="st-to" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <label htmlFor="st-msg">{t.message}</label>
            <textarea id="st-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {templates.map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-full px-3 py-2 text-xs ${template === item ? "bg-gold text-night" : "bg-white/10"}`}
                onClick={() => setTemplate(item)}
              >
                {t.templates[item]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {fonts.map((item) => (
              <button
                key={item}
                type="button"
                className={`rounded-full px-3 py-2 text-xs ${font === item ? "bg-gold text-night" : "bg-white/10"}`}
                onClick={() => setFont(item)}
              >
                {t.fonts[item]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {accents.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={color}
                className="h-8 w-8 rounded-full border border-white/30"
                style={{ background: color }}
                onClick={() => setAccent(color)}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {stickerSets.map((set) => (
              <button
                key={set.join()}
                type="button"
                className="rounded-full bg-white/10 px-3 py-2 text-lg"
                onClick={() => setStickers(set)}
              >
                {set.join(" ")}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div ref={cardRef}>
            <GreetingCard payload={payload} />
          </div>
          <button
            type="button"
            className="btn-gold mt-4 w-full"
            onClick={async () => {
              if (!cardRef.current) return;
              try {
                await downloadNodePng(cardRef.current, "diwali-studio-card.png");
                setStatus("");
              } catch {
                setStatus(t.downloadFailed);
              }
            }}
          >
            <Download size={16} /> {t.downloadCard}
          </button>
          {status ? <p className="mt-2 text-sm text-gold">{status}</p> : null}
        </div>
      </div>
    </section>
  );
}
