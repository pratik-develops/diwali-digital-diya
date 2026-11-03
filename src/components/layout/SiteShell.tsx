"use client";

import { AppProviders } from "@/components/providers/AppProviders";
import { FestiveBackdrop } from "@/components/effects/FestiveBackdrop";
import { GlobalFireworks } from "@/components/effects/GlobalFireworks";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <a
        href="#welcome"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-night"
      >
        Skip to celebration
      </a>
      <FestiveBackdrop />
      <GlobalFireworks />
      <SiteHeader />
      <main className="relative z-10 flex-1">{children}</main>
      <SiteFooter />
    </AppProviders>
  );
}
