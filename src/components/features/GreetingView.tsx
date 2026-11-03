"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GreetingCard } from "@/components/cards/GreetingCard";
import { useApp } from "@/components/providers/AppProviders";
import { decodePayload } from "@/lib/payload";
import type { GreetingPayload } from "@/lib/types";

export function GreetingView() {
  const { t } = useApp();
  const params = useSearchParams();
  const payload = decodePayload<GreetingPayload>(params.get("d"));
  const valid =
    payload &&
    payload.v === 1 &&
    typeof payload.from === "string" &&
    typeof payload.to === "string" &&
    typeof payload.message === "string";

  if (!valid) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-lg">{t.invalidGreeting}</p>
        <Link href="/#greet" className="btn-gold mt-6">
          {t.createOwn}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="mb-6 text-center text-xs tracking-[0.3em] text-gold uppercase">
        {t.brand}
      </p>
      <GreetingCard payload={payload} />
      <div className="mt-6 flex justify-center">
        <Link href="/#greet" className="btn-ghost">
          {t.createOwn}
        </Link>
      </div>
    </div>
  );
}
