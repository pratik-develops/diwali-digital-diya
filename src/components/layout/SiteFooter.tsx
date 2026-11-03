"use client";

import { useApp } from "@/components/providers/AppProviders";

export function SiteFooter() {
  const { t } = useApp();
  return (
    <footer className="relative mt-16 border-t border-gold/20 bg-[#0c0108]/80 px-4 py-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-display text-2xl text-gold">Diwali Digital Diya</p>
        <p className="mt-4 text-sm text-amber-100/80">
          Designed &amp; Developed by Pratik Saha
        </p>
        <p className="mt-1 text-sm text-amber-100/80">Team: Lapiz</p>
        <p className="mt-6 text-xs leading-relaxed text-amber-100/60">{t.footerNote}</p>
      </div>
    </footer>
  );
}
