"use client";

import Link from "next/link";
import { ChevronDown, Menu, Music, Pause, X } from "lucide-react";
import { useEffect, useState } from "react";
import { languages } from "@/lib/i18n";
import { exploreItems, navItems } from "@/lib/nav";
import { useApp } from "@/components/providers/AppProviders";
import { Diya } from "@/components/ui/Diya";

export function SiteHeader() {
  const { t, language, setLanguage, ambientOn, toggleAmbient } = useApp();
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExploreOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-[#16030f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Diya lit size={36} />
          <span className="font-display text-sm tracking-wide text-gold sm:text-base">
            {t.brand}
          </span>
        </Link>
        <nav className="hidden max-w-4xl flex-wrap items-center justify-end gap-x-3 gap-y-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs font-semibold text-amber-100/80 transition-colors duration-200 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={exploreOpen}
              aria-controls="explore-menu"
              onClick={() => setExploreOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold transition hover:bg-gold/15"
            >
              Explore
              <ChevronDown size={14} className={exploreOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
            {exploreOpen ? (
              <div
                id="explore-menu"
                role="menu"
                className="absolute right-0 top-full mt-3 w-[min(92vw,28rem)] rounded-[1.5rem] border border-gold/20 bg-[#220a18]/95 p-3 shadow-2xl backdrop-blur-xl"
              >
                <div className="grid gap-2">
                  {exploreItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setExploreOpen(false)}
                      className="rounded-2xl border border-transparent bg-white/3 p-3 text-left transition hover:border-gold/40 hover:bg-gold/5"
                    >
                      <span className="block text-sm font-semibold text-amber-50">{item.label}</span>
                      <span className="mt-1 block text-xs text-amber-100/70">{item.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </nav>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="lang">
            {t.language}
          </label>
          <select
            id="lang"
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }
            className="w-auto rounded-full px-3 py-1 text-xs"
          >
            {languages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-ghost px-3 py-2"
            onClick={toggleAmbient}
            aria-pressed={ambientOn}
            title={t.ambient}
          >
            {ambientOn ? <Pause size={16} /> : <Music size={16} />}
            <span className="sr-only">{ambientOn ? t.pause : t.play}</span>
          </button>
          <button
            type="button"
            className="btn-ghost px-3 py-2 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          className="grid gap-2 px-4 pb-4 lg:hidden"
          aria-label="Mobile"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm text-amber-50/90 transition-colors hover:bg-white/10 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <div className="rounded-xl bg-white/5 p-2">
            <p className="mb-2 px-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold/80">Explore</p>
            {exploreItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm text-amber-50/90 transition-colors hover:bg-white/10 hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
