"use client";

import { AnimatePresence, motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import {
  Copy,
  Download,
  Link2,
  Mail,
  QrCode,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GreetingCard } from "@/components/cards/GreetingCard";
import { useApp } from "@/components/providers/AppProviders";
import { languages } from "@/lib/i18n";
import { copyText, downloadNodePng } from "@/lib/download";
import { composeGreeting, greetingAsText } from "@/lib/greetings";
import { shareUrl } from "@/lib/payload";
import type {
  CardFont,
  CardTemplate,
  GreetingPayload,
  GreetingStyle,
  Language,
  LetterPayload,
} from "@/lib/types";

type StudioMode = "card" | "letter" | "qr";

const modes: { id: StudioMode; label: string; icon: typeof Sparkles }[] = [
  { id: "card", label: "Greeting card", icon: Sparkles },
  { id: "letter", label: "Secret letter", icon: Mail },
  { id: "qr", label: "QR greeting", icon: QrCode },
];

const styles: GreetingStyle[] = ["traditional", "emotional", "funny", "elegant"];
const templates: CardTemplate[] = ["royal", "marigold", "peacock", "night"];
const fonts: CardFont[] = ["display", "elegant", "playful"];
const accents = ["#fff7e8", "#ffd56a", "#7ad1c4", "#ffb6c8"];
const stickerSets = [
  ["🪔", "✨", "🌸"],
  ["🎆", "💛", "🪷"],
  ["🌙", "⭐", "🪔"],
  ["🌺", "🕯️", "💫"],
];

function modeForHash(hash: string): StudioMode | null {
  if (hash === "#letter") return "letter";
  if (hash === "#qr") return "qr";
  if (hash === "#greet" || hash === "#studio" || hash === "#share") return "card";
  return null;
}

async function shareOrCopy(url: string, title: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return false;
      throw error;
    }
  }
  return copyText(url);
}

function GreetingDetails({
  from,
  to,
  message,
  language,
  onFromChange,
  onToChange,
  onMessageChange,
  onLanguageChange,
  messageLimit = 400,
}: {
  from: string;
  to: string;
  message: string;
  language: Language;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onLanguageChange: (value: Language) => void;
  messageLimit?: number;
}) {
  const { t } = useApp();

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="studio-from">{t.from}</label>
        <input
          id="studio-from"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="studio-to">{t.to}</label>
        <input
          id="studio-to"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="studio-message">{t.message}</label>
        <textarea
          id="studio-message"
          rows={4}
          maxLength={messageLimit}
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="studio-language">{t.language}</label>
        <select
          id="studio-language"
          value={language}
          onChange={(event) => onLanguageChange(event.target.value as Language)}
        >
          {languages.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function DiwaliGreetingStudio() {
  const { t, language, setLanguage, play } = useApp();
  const [mode, setMode] = useState<StudioMode>("card");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<GreetingStyle>("traditional");
  const [template, setTemplate] = useState<CardTemplate>("royal");
  const [font, setFont] = useState<CardFont>("display");
  const [accent, setAccent] = useState(accents[0]);
  const [stickers, setStickers] = useState(stickerSets[0]);
  const [qrCreated, setQrCreated] = useState(false);
  const [letterUrl, setLetterUrl] = useState("");
  const [letterSealed, setLetterSealed] = useState(false);
  const [status, setStatus] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const cardPayload: GreetingPayload = useMemo(
    () => ({
      v: 1,
      from: from.trim() || "A friend",
      to: to.trim() || "Dear one",
      language,
      style,
      template,
      font,
      accent,
      stickers,
      message: composeGreeting({
        from,
        to,
        language,
        style,
        template,
        message,
      }),
    }),
    [from, to, language, style, template, font, accent, stickers, message],
  );

  const qrUrl = qrCreated ? shareUrl("/greet", cardPayload) : "";

  useEffect(() => {
    const syncModeToHash = () => {
      const nextMode = modeForHash(window.location.hash);
      if (nextMode) setMode(nextMode);
    };

    syncModeToHash();
    window.addEventListener("hashchange", syncModeToHash);
    return () => window.removeEventListener("hashchange", syncModeToHash);
  }, []);

  const selectMode = (nextMode: StudioMode) => {
    setMode(nextMode);
    setStatus("");
    const hash = nextMode === "card" ? "greet" : nextMode;
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${hash}`,
    );
  };

  const share = async (url: string, title: string) => {
    try {
      const shared = await shareOrCopy(url, title);
      setStatus(shared ? t.shareReady : "");
    } catch {
      setStatus(t.downloadFailed);
    }
  };

  const sealLetter = () => {
    const payload: LetterPayload = {
      v: 1,
      from: from.trim() || "Someone who cares",
      to: to.trim() || "You",
      message: message.trim() || t.tagline,
    };
    setLetterUrl(shareUrl("/letter", payload));
    setLetterSealed(true);
    play("open");
    setStatus("");
  };

  return (
    <section
      id="create"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20"
      aria-labelledby="greeting-studio-title"
    >
      <span id="share" className="block scroll-mt-24" aria-hidden="true" />
      <span id="greet" className="block scroll-mt-24" aria-hidden="true" />
      <span id="studio" className="block scroll-mt-24" aria-hidden="true" />
      <span id="qr" className="block scroll-mt-24" aria-hidden="true" />
      <span id="letter" className="block scroll-mt-24" aria-hidden="true" />
      <header className="mx-auto mb-8 max-w-3xl text-center">
        <p className="mb-2 text-xs font-bold tracking-[0.28em] text-gold uppercase">
          Share the light
        </p>
        <h2
          id="greeting-studio-title"
          className="font-display gold-text text-3xl leading-tight sm:text-5xl"
        >
          Diwali Greeting Studio
        </h2>
        <p className="mt-4 text-base text-amber-100/80 sm:text-lg">
          Create a beautiful Diwali greeting, personalise it with love, and share a
          little happiness with someone special.
        </p>
      </header>

      <div
        className="mx-auto mb-8 grid max-w-2xl grid-cols-3 gap-2 rounded-full border border-gold/20 bg-[#16030f]/75 p-1.5"
        role="tablist"
        aria-label="Greeting type"
      >
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`studio-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={mode === id}
            aria-controls={`studio-panel-${id}`}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-2 py-2 text-xs font-bold transition-colors sm:px-4 sm:text-sm ${
              mode === id
                ? "bg-gold text-night shadow-[0_0_24px_rgba(255,213,106,0.18)]"
                : "text-amber-100/75 hover:bg-white/5 hover:text-gold"
            }`}
            onClick={() => selectMode(id)}
            onKeyDown={(event) => {
              const currentIndex = modes.findIndex((item) => item.id === mode);
              let nextIndex = currentIndex;
              if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % modes.length;
              else if (event.key === "ArrowLeft") {
                nextIndex = (currentIndex - 1 + modes.length) % modes.length;
              } else if (event.key === "Home") nextIndex = 0;
              else if (event.key === "End") nextIndex = modes.length - 1;
              else return;

              event.preventDefault();
              const nextMode = modes[nextIndex].id;
              selectMode(nextMode);
              document.getElementById(`studio-tab-${nextMode}`)?.focus();
            }}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {mode === "card" ? (
          <motion.div
            key="card"
            id="studio-panel-card"
            role="tabpanel"
            aria-labelledby="studio-tab-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid items-start gap-6 lg:grid-cols-[0.92fr_1.08fr]"
          >
            <div className="festive-card space-y-5 rounded-[2rem] p-5 sm:p-7">
              <GreetingDetails
                from={from}
                to={to}
                message={message}
                language={language}
                onFromChange={setFrom}
                onToChange={setTo}
                onMessageChange={setMessage}
                onLanguageChange={setLanguage}
              />
              <fieldset>
                <legend className="mb-2 text-sm text-gold">{t.style}</legend>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={style === item}
                      className={`rounded-full px-3 py-2 text-sm transition-colors ${
                        style === item ? "bg-gold text-night" : "bg-white/10 hover:bg-white/15"
                      }`}
                      onClick={() => setStyle(item)}
                    >
                      {t.styles[item]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-2 text-sm text-gold">Card template</legend>
                <div className="flex flex-wrap gap-2">
                  {templates.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={template === item}
                      className={`rounded-full px-3 py-2 text-xs transition-colors ${
                        template === item ? "bg-gold text-night" : "bg-white/10 hover:bg-white/15"
                      }`}
                      onClick={() => setTemplate(item)}
                    >
                      {t.templates[item]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-2 text-sm text-gold">Font style</legend>
                <div className="flex flex-wrap gap-2">
                  {fonts.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={font === item}
                      className={`rounded-full px-3 py-2 text-xs transition-colors ${
                        font === item ? "bg-gold text-night" : "bg-white/10 hover:bg-white/15"
                      }`}
                      onClick={() => setFont(item)}
                    >
                      {t.fonts[item]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-2 text-sm text-gold">Card colour</legend>
                <div className="flex flex-wrap gap-3">
                  {accents.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Set card text colour to ${color}`}
                      aria-pressed={accent === color}
                      className={`h-9 w-9 rounded-full border border-white/40 ${
                        accent === color ? "ring-2 ring-gold ring-offset-2 ring-offset-[#240b19]" : ""
                      }`}
                      style={{ background: color }}
                      onClick={() => setAccent(color)}
                    />
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-2 text-sm text-gold">Festive stickers</legend>
                <div className="flex flex-wrap gap-2">
                  {stickerSets.map((set) => (
                    <button
                      key={set.join()}
                      type="button"
                      aria-label={`Use ${set.join(" ")} stickers`}
                      aria-pressed={stickers === set}
                      className={`rounded-full px-3 py-2 text-lg ${
                        stickers === set
                          ? "bg-gold/20 ring-1 ring-gold/70"
                          : "bg-white/10 hover:bg-white/15"
                      }`}
                      onClick={() => setStickers(set)}
                    >
                      {set.join(" ")}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="space-y-4 lg:sticky lg:top-28">
              <div ref={cardRef}>
                <GreetingCard payload={cardPayload} />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => {
                    play("open");
                    setStatus("Your greeting is ready to share.");
                  }}
                >
                  <Sparkles size={16} /> {t.generate}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={async () => {
                    const ok = await copyText(greetingAsText(cardPayload));
                    setStatus(ok ? t.copied : t.downloadFailed);
                  }}
                >
                  <Copy size={16} /> {t.copyGreeting}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={async () => {
                    const ok = await copyText(shareUrl("/greet", cardPayload));
                    setStatus(ok ? t.shareReady : t.downloadFailed);
                  }}
                >
                  <Link2 size={16} /> {t.shareGreeting}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() =>
                    void share(
                      shareUrl("/greet", cardPayload),
                      "A Diwali greeting for you",
                    )
                  }
                >
                  <Share2 size={16} /> Share
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={async () => {
                    if (!cardRef.current) return;
                    try {
                      await downloadNodePng(cardRef.current, "diwali-greeting.png");
                      setStatus("");
                    } catch {
                      setStatus(t.downloadFailed);
                    }
                  }}
                >
                  <Download size={16} /> {t.downloadCard}
                </button>
              </div>
              {status ? (
                <p className="text-center text-sm text-gold" role="status">
                  {status}
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}

        {mode === "letter" ? (
          <motion.div
            key="letter"
            id="studio-panel-letter"
            role="tabpanel"
            aria-labelledby="studio-tab-letter"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid items-center gap-6 lg:grid-cols-2"
          >
            <div className="festive-card space-y-5 rounded-[2rem] p-5 sm:p-7">
              <div>
                <h3 className="font-display text-2xl text-amber-50">
                  A Letter from the Heart
                </h3>
                <p className="mt-2 text-sm leading-6 text-amber-100/70">
                  Seal a private greeting in a digital envelope. Anyone with the
                  link can open it.
                </p>
              </div>
              <GreetingDetails
                from={from}
                to={to}
                message={message}
                language={language}
                onFromChange={setFrom}
                onToChange={setTo}
                onMessageChange={setMessage}
                onLanguageChange={setLanguage}
              />
              <button type="button" className="btn-gold w-full" onClick={sealLetter}>
                <Mail size={17} /> {t.sealLetter}
              </button>
            </div>
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              {letterSealed ? (
                <motion.div
                  className="relative flex h-48 w-72 items-center justify-center"
                  initial={{ scale: 0.82, opacity: 0, rotate: -4 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 16 }}
                  aria-label="Sealed Diwali letter"
                >
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#5a1028] to-burgundy shadow-2xl" />
                  <motion.span
                    className="absolute inset-x-0 top-0 h-24 origin-top rounded-t-2xl bg-gold/90 [clip-path:polygon(0_0,100%_0,50%_100%)]"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.12, duration: 0.38 }}
                  />
                  <span className="relative z-10 rounded-full bg-gold px-3 py-1 text-xs font-bold text-night">
                    Sealed with love
                  </span>
                </motion.div>
              ) : (
                <div className="flex h-48 w-72 items-center justify-center rounded-2xl border border-dashed border-gold/30 bg-white/[0.03]">
                  <Mail className="text-gold/70" size={40} />
                </div>
              )}
              {letterUrl ? (
                <div className="mt-6 space-y-3">
                  <p className="max-w-lg break-all text-xs text-amber-100/70">
                    {letterUrl}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={async () => {
                        const ok = await copyText(letterUrl);
                        setStatus(ok ? t.shareReady : t.downloadFailed);
                      }}
                    >
                      <Link2 size={16} /> {t.copyLink}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => void share(letterUrl, "A secret Diwali letter")}
                    >
                      <Share2 size={16} /> Share letter
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-5 max-w-sm text-sm leading-6 text-amber-100/65">
                  Your sealed envelope and its private share link will appear here.
                </p>
              )}
              {status ? (
                <p className="mt-3 text-center text-sm text-gold" role="status">
                  {status}
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}

        {mode === "qr" ? (
          <motion.div
            key="qr"
            id="studio-panel-qr"
            role="tabpanel"
            aria-labelledby="studio-tab-qr"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid items-start gap-6 lg:grid-cols-2"
          >
            <div className="festive-card space-y-5 rounded-[2rem] p-5 sm:p-7">
              <div>
                <h3 className="font-display text-2xl text-amber-50">
                  A Greeting Worth Sharing
                </h3>
                <p className="mt-2 text-sm leading-6 text-amber-100/70">
                  Generate a QR code that opens this personalised greeting on any
                  device.
                </p>
              </div>
              <GreetingDetails
                from={from}
                to={to}
                message={message}
                language={language}
                onFromChange={setFrom}
                onToChange={setTo}
                onMessageChange={setMessage}
                onLanguageChange={setLanguage}
              />
              <button
                type="button"
                className="btn-gold w-full"
                onClick={() => {
                  setQrCreated(true);
                  setStatus("");
                }}
              >
                <QrCode size={17} /> Generate QR code
              </button>
            </div>
            <div className="space-y-4">
              {qrCreated ? (
                <>
                  <GreetingCard payload={cardPayload} />
                  <div
                    ref={qrRef}
                    className="mx-auto flex w-fit justify-center rounded-3xl bg-white p-4"
                  >
                    <QRCodeCanvas value={qrUrl} size={220} marginSize={4} />
                  </div>
                  <p className="break-all text-center text-xs text-amber-100/70">
                    {qrUrl}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={async () => {
                        const ok = await copyText(qrUrl);
                        setStatus(ok ? t.shareReady : t.downloadFailed);
                      }}
                    >
                      <Link2 size={16} /> {t.copyLink}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => void share(qrUrl, "A Diwali greeting for you")}
                    >
                      <Share2 size={16} /> Share greeting
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => {
                        const canvas = qrRef.current?.querySelector("canvas");
                        if (!canvas) {
                          setStatus(t.downloadFailed);
                          return;
                        }
                        const link = document.createElement("a");
                        link.download = "diwali-qr.png";
                        link.href = canvas.toDataURL("image/png");
                        link.click();
                      }}
                    >
                      <Download size={16} /> {t.downloadQr}
                    </button>
                  </div>
                  {status ? (
                    <p className="text-center text-sm text-gold" role="status">
                      {status}
                    </p>
                  ) : null}
                </>
              ) : (
                <div className="festive-card flex min-h-80 items-center justify-center rounded-[2rem] p-8 text-center text-amber-100/70">
                  Your greeting preview and scannable QR code will appear here.
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
