"use client";

import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApp } from "@/components/providers/AppProviders";
import { downloadNodePng } from "@/lib/download";

const palettes = [
  ["#ffd56a", "#ff8a1e", "#7a1238", "#fff7e8"],
  ["#ff6b9d", "#c084fc", "#4a0d5c", "#ffd56a"],
  ["#12899a", "#0f8a55", "#ffd56a", "#fff7e8"],
  ["#fff7e8", "#ffb347", "#c45c18", "#7a1238"],
];

const patterns = ["lotus", "star", "mandala"] as const;

export function RangoliCreator() {
  const { t } = useApp();
  const boardRef = useRef<HTMLDivElement>(null);
  const [pattern, setPattern] = useState<(typeof patterns)[number]>("lotus");
  const [palette, setPalette] = useState(0);
  const [status, setStatus] = useState("");
  const colors = palettes[palette];

  return (
    <section id="rangoli" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        kicker="Floor of colour"
        title="Colours of Celebration"
        lead="Choose a pattern and a palette, then watch colour bloom across the floor."
      />
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {patterns.map((item) => (
          <button
            key={item}
            type="button"
            className={`rounded-full px-4 py-2 text-sm ${pattern === item ? "bg-gold text-night" : "bg-white/10"}`}
            onClick={() => setPattern(item)}
          >
            {item}
          </button>
        ))}
        {palettes.map((item, index) => (
          <button
            key={item.join()}
            type="button"
            aria-label={`Palette ${index + 1}`}
            className={`flex h-10 items-center gap-1 rounded-full px-3 ${palette === index ? "ring-2 ring-gold" : ""}`}
            onClick={() => setPalette(index)}
          >
            {item.map((color) => (
              <span key={color} className="h-5 w-5 rounded-full" style={{ background: color }} />
            ))}
          </button>
        ))}
      </div>
      <div ref={boardRef} className="festive-card mx-auto max-w-xl rounded-[2rem] p-6">
        <svg viewBox="0 0 320 320" className="rangoli-reveal h-auto w-full" key={`${pattern}-${palette}`}>
          <rect width="320" height="320" rx="40" fill="#14020f" />
          {pattern === "lotus" ? (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx="160"
                  cy="160"
                  rx="42"
                  ry="88"
                  fill={colors[i % colors.length]}
                  opacity="0.85"
                  transform={`rotate(${i * 45} 160 160)`}
                />
              ))}
              <circle cx="160" cy="160" r="36" fill={colors[0]} />
              <circle cx="160" cy="160" r="16" fill={colors[2]} />
            </>
          ) : null}
          {pattern === "star" ? (
            <>
              {Array.from({ length: 12 }).map((_, i) => (
                <path
                  key={i}
                  d="M160 40 L176 130 L260 130 L192 176 L214 260 L160 210 L106 260 L128 176 L60 130 L144 130 Z"
                  fill={colors[i % colors.length]}
                  opacity="0.55"
                  transform={`rotate(${i * 30} 160 160) scale(0.42)`}
                />
              ))}
              <circle cx="160" cy="160" r="28" fill={colors[1]} />
            </>
          ) : null}
          {pattern === "mandala" ? (
            <>
              {Array.from({ length: 16 }).map((_, i) => (
                <circle
                  key={i}
                  cx={160 + Math.cos((i / 16) * Math.PI * 2) * 90}
                  cy={160 + Math.sin((i / 16) * Math.PI * 2) * 90}
                  r="18"
                  fill={colors[i % colors.length]}
                />
              ))}
              <circle cx="160" cy="160" r="70" fill="none" stroke={colors[0]} strokeWidth="6" />
              <circle cx="160" cy="160" r="40" fill={colors[1]} />
              <circle cx="160" cy="160" r="14" fill={colors[3]} />
            </>
          ) : null}
        </svg>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="btn-gold"
          onClick={async () => {
            if (!boardRef.current) return;
            try {
              await downloadNodePng(boardRef.current, "diwali-rangoli.png");
              setStatus("");
            } catch {
              setStatus(t.downloadFailed);
            }
          }}
        >
          <Download size={16} /> {t.downloadRangoli}
        </button>
      </div>
      {status ? <p className="mt-3 text-center text-sm text-gold">{status}</p> : null}
    </section>
  );
}
