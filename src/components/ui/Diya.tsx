"use client";

import { useId } from "react";

type DiyaProps = {
  lit: boolean;
  size?: number;
  className?: string;
  onClick?: () => void;
  label?: string;
};

export function Diya({ lit, size = 72, className = "", onClick, label }: DiyaProps) {
  const gradientId = useId().replace(/:/g, "");
  const flame = (
    <svg viewBox="0 0 90 110" className="relative z-10 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fff7c2" />
          <stop offset="45%" stopColor="#ffd56a" />
          <stop offset="100%" stopColor="#ff6a1a" />
        </radialGradient>
      </defs>
      {lit ? (
        <>
          <ellipse
            className="flame"
            cx="45"
            cy="34"
            rx="12"
            ry="24"
            fill={`url(#${gradientId})`}
          />
          <path d="M45 22c3 6 3 11 0 16-3-5-3-10 0-16z" fill="#fff8dc" />
        </>
      ) : (
        <rect x="43" y="42" width="4" height="12" rx="1" fill="#5a2a12" />
      )}
      <path
        d="M10 68c12 22 58 22 70 0-5 22-24 34-35 34S15 90 10 68z"
        fill="#c45c18"
      />
      <path d="M16 66c9 12 49 12 58 0-9 9-49 9-58 0z" fill="#f0a04a" />
      <ellipse cx="45" cy="64" rx="28" ry="7" fill="#8a3b12" />
      <ellipse cx="45" cy="63" rx="18" ry="4" fill="#3a1608" />
    </svg>
  );

  const inner = (
    <>
      {lit ? (
        <span
          className="absolute bottom-[38%] h-[58%] w-[58%] rounded-full bg-saffron/45 blur-xl"
          aria-hidden
        />
      ) : null}
      {flame}
    </>
  );

  const style = { width: size, height: size * 1.15 };
  const classes = `relative inline-flex items-end justify-center ${className}`;

  if (!onClick) {
    return (
      <div className={classes} style={style} aria-hidden>
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={lit}
      aria-label={label ?? (lit ? "Extinguish diya" : "Light diya")}
      className={classes}
      style={style}
    >
      {inner}
    </button>
  );
}
