"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";
import { copyText } from "@/lib/download";
import { shareUrl } from "@/lib/payload";
import type { LetterPayload } from "@/lib/types";

export function SecretLetter() {
  const { t, play } = useApp();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  return (
    <section id="letter" className="mx-auto max-w-3xl px-4 py-20">
      <SectionHeading kicker="Private light" title={t.letterTitle} lead={t.letterLead} />
      <form
        className="festive-card space-y-4 rounded-[2rem] p-6"
        onSubmit={(event) => {
          event.preventDefault();
          const payload: LetterPayload = {
            v: 1,
            from: from.trim() || "Someone who cares",
            to: to.trim() || "You",
            message: message.trim() || t.tagline,
          };
          const next = shareUrl("/letter", payload);
          setUrl(next);
          play("open");
        }}
      >
        <div>
          <label htmlFor="lt-from">{t.from}</label>
          <input id="lt-from" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label htmlFor="lt-to">{t.to}</label>
          <input id="lt-to" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div>
          <label htmlFor="lt-msg">{t.message}</label>
          <textarea
            id="lt-msg"
            rows={5}
            maxLength={400}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-gold w-full">
          {t.sealLetter}
        </button>
      </form>
      {url ? (
        <div className="mt-6 space-y-3 text-center">
          <p className="break-all text-sm text-amber-100/80">{url}</p>
          <button
            type="button"
            className="btn-ghost"
            onClick={async () => {
              const ok = await copyText(url);
              setStatus(ok ? t.shareReady : t.downloadFailed);
            }}
          >
            <Link2 size={16} /> {t.copyLink}
          </button>
          {status ? <p className="text-sm text-gold">{status}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
