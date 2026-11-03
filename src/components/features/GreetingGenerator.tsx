"use client";

import { useRef, useState } from "react";
import { Copy, Download, Link2 } from "lucide-react";
import { GreetingCard } from "@/components/cards/GreetingCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";
import { copyText, downloadNodePng } from "@/lib/download";
import { composeGreeting, greetingAsText } from "@/lib/greetings";
import { shareUrl } from "@/lib/payload";
import type { GreetingPayload, GreetingStyle } from "@/lib/types";

const styles: GreetingStyle[] = ["traditional", "emotional", "funny", "elegant"];

export function GreetingGenerator() {
  const { t, language, play } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<GreetingStyle>("traditional");
  const [payload, setPayload] = useState<GreetingPayload | null>(null);
  const [status, setStatus] = useState("");

  const generate = () => {
    const next: GreetingPayload = {
      v: 1,
      from: from.trim() || "A friend",
      to: to.trim() || "Dear one",
      language,
      style,
      template: "royal",
      message: composeGreeting({
        from,
        to,
        language,
        style,
        template: "royal",
        message,
      }),
    };
    setPayload(next);
    play("open");
    setStatus("");
  };

  return (
    <section id="greet" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading kicker="Share the light" title={t.greetTitle} lead={t.greetLead} />
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className="festive-card space-y-4 rounded-[2rem] p-6"
          onSubmit={(event) => {
            event.preventDefault();
            generate();
          }}
        >
          <div>
            <label htmlFor="from">{t.from}</label>
            <input id="from" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label htmlFor="to">{t.to}</label>
            <input id="to" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <label htmlFor="msg">{t.message}</label>
            <textarea
              id="msg"
              rows={4}
              maxLength={400}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div>
            <p className="mb-2 text-sm text-gold">{t.style}</p>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-full px-3 py-2 text-sm ${
                    style === item ? "bg-gold text-night" : "bg-white/10"
                  }`}
                  onClick={() => setStyle(item)}
                >
                  {t.styles[item]}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-gold w-full">
            {t.generate}
          </button>
        </form>
        <div className="space-y-4">
          {payload ? (
            <>
              <div ref={cardRef}>
                <GreetingCard payload={payload} />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={async () => {
                    const ok = await copyText(greetingAsText(payload));
                    setStatus(ok ? t.copied : t.downloadFailed);
                  }}
                >
                  <Copy size={16} /> {t.copyGreeting}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={async () => {
                    const ok = await copyText(shareUrl("/greet", payload));
                    setStatus(ok ? t.shareReady : t.downloadFailed);
                  }}
                >
                  <Link2 size={16} /> {t.shareGreeting}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={async () => {
                    if (!cardRef.current) return;
                    try {
                      await downloadNodePng(cardRef.current, "diwali-greeting.png");
                    } catch {
                      setStatus(t.downloadFailed);
                    }
                  }}
                >
                  <Download size={16} /> {t.downloadCard}
                </button>
              </div>
              {status ? <p className="text-sm text-gold">{status}</p> : null}
            </>
          ) : (
            <div className="festive-card flex min-h-80 items-center justify-center rounded-[2rem] p-8 text-center text-amber-100/70">
              {t.greetLead}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
