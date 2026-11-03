import type { CardFont, CardTemplate, GreetingPayload } from "@/lib/types";

const templates: Record<CardTemplate, string> = {
  royal:
    "bg-[radial-gradient(circle_at_top,#7a1238,transparent_45%),linear-gradient(160deg,#2a0618,#4a0d5c)]",
  marigold:
    "bg-[radial-gradient(circle_at_20%_20%,#ffb34766,transparent_40%),linear-gradient(160deg,#5a1a08,#c45c18)]",
  peacock:
    "bg-[radial-gradient(circle_at_80%_0%,#12899a88,transparent_40%),linear-gradient(160deg,#062428,#0f8a55)]",
  night:
    "bg-[radial-gradient(circle_at_50%_0%,#ff6b9d55,transparent_42%),linear-gradient(180deg,#12010d,#1a2050)]",
};

const fonts: Record<CardFont, string> = {
  display: "font-display",
  elegant: "font-elegant",
  playful: "font-playful",
};

export function GreetingCard({
  payload,
  id,
}: {
  payload: GreetingPayload;
  id?: string;
}) {
  const font = fonts[payload.font ?? "display"];
  return (
    <article
      id={id}
      className={`relative overflow-hidden rounded-[2rem] p-8 text-center shadow-2xl ${templates[payload.template]}`}
      style={{ color: payload.accent || "#fff7e8" }}
    >
      <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-gold/40" />
      <p className="text-xs tracking-[0.35em] text-gold uppercase">Happy Diwali</p>
      <h3 className={`mt-4 text-3xl ${font}`}>Dear {payload.to}</h3>
      <p className={`mx-auto mt-5 max-w-md text-sm leading-relaxed sm:text-base ${font}`}>
        {payload.message}
      </p>
      <p className={`mt-6 text-sm italic ${font}`}>— {payload.from}</p>
      <div className="mt-6 flex justify-center gap-3 text-2xl" aria-hidden>
        {(payload.stickers?.length ? payload.stickers : ["🪔", "✨", "🌸"]).map(
          (sticker, index) => (
            <span key={`${sticker}-${index}`}>{sticker}</span>
          ),
        )}
      </div>
    </article>
  );
}
