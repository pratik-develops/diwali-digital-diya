"use client";

import { useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Link2 } from "lucide-react";
import { GreetingCard } from "@/components/cards/GreetingCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";
import { composeGreeting } from "@/lib/greetings";
import { shareUrl } from "@/lib/payload";
import { copyText } from "@/lib/download";
import type { GreetingPayload } from "@/lib/types";

export function QrGreeting() {
  const { t, language } = useApp();
  const canvasWrap = useRef<HTMLDivElement>(null);
  const [from, setFrom] = useState("Pratik");
  const [to, setTo] = useState("Family");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [origin, setOrigin] = useState("");

  const payload: GreetingPayload = useMemo(
    () => ({
      v: 1,
      from: from.trim() || "A friend",
      to: to.trim() || "Dear one",
      language,
      style: "elegant",
      template: "peacock",
      message: composeGreeting({
        from,
        to,
        language,
        style: "elegant",
        template: "peacock",
        message,
      }),
    }),
    [from, to, language, message],
  );

  const url = origin ? shareUrl("/greet", payload) : "";

  return (
    <section id="qr" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        kicker="Carry the greeting"
        title="A Greeting Worth Sharing"
        lead="Create a QR code that opens a personalised greeting page on another device."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className="festive-card space-y-4 rounded-[2rem] p-6"
          onSubmit={(event) => {
            event.preventDefault();
            setOrigin(window.location.origin);
          }}
        >
          <div>
            <label htmlFor="qr-from">{t.from}</label>
            <input id="qr-from" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label htmlFor="qr-to">{t.to}</label>
            <input id="qr-to" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div>
            <label htmlFor="qr-msg">{t.message}</label>
            <textarea
              id="qr-msg"
              rows={3}
              maxLength={220}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-gold w-full">
            {t.generate}
          </button>
        </form>
        <div className="space-y-4">
          {origin ? (
            <>
              <GreetingCard payload={payload} />
              <div ref={canvasWrap} className="flex justify-center rounded-3xl bg-white p-4">
                <QRCodeCanvas value={url} size={220} marginSize={4} />
              </div>
              <p className="break-all text-center text-xs text-amber-100/70">{url}</p>
              <div className="flex flex-wrap justify-center gap-2">
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
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    const canvas = canvasWrap.current?.querySelector("canvas");
                    if (!canvas) return;
                    const link = document.createElement("a");
                    link.download = "diwali-qr.png";
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                  }}
                >
                  <Download size={16} /> {t.downloadQr}
                </button>
              </div>
              {status ? <p className="text-center text-sm text-gold">{status}</p> : null}
            </>
          ) : (
            <div className="festive-card flex min-h-80 items-center justify-center rounded-[2rem] p-8 text-center text-amber-100/70">
              {t.qrLead}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
