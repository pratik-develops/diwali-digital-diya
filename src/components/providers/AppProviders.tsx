"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import {
  playFx,
  preloadFireworkSound,
  startAmbient,
  stopAmbient,
  stopFireworkSound,
  type SoundFx,
} from "@/lib/audio";
import { copy, type Copy } from "@/lib/i18n";
import { useStoredJson } from "@/lib/storage";
import type { Language } from "@/lib/types";

type SoundSettings = {
  fxOn: boolean;
  ambientOn: boolean;
};

const DEFAULT_SOUND: SoundSettings = { fxOn: false, ambientOn: false };

type AppContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Copy;
  fxOn: boolean;
  ambientOn: boolean;
  toggleFx: () => void;
  toggleAmbient: () => void;
  play: (kind: SoundFx) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useStoredJson<Language>(
    "diya-lang",
    "en",
  );
  const [sound, setSound] = useStoredJson("diya-sound", DEFAULT_SOUND);
  const [ambientOn, setAmbientOn] = useState(false);
  const fxOn = sound.fxOn;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.lang = language;
  }, [language]);

  useEffect(() => {
    return () => stopAmbient();
  }, []);

  useEffect(() => {
    if (fxOn) {
      preloadFireworkSound();
    } else {
      stopFireworkSound();
    }
  }, [fxOn]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, [setLanguageState]);

  const toggleFx = useCallback(() => {
    if (fxOn) {
      stopFireworkSound();
    } else {
      preloadFireworkSound();
    }
    setSound((prev) => ({ ...prev, fxOn: !prev.fxOn, ambientOn: false }));
  }, [fxOn, setSound]);

  const toggleAmbient = useCallback(async () => {
    const next = !ambientOn;
    if (next) {
      await startAmbient();
    } else {
      stopAmbient();
    }
    setAmbientOn(next);
  }, [ambientOn]);

  const play = useCallback(
    (kind: SoundFx) => {
      if (!fxOn) return;
      void playFx(kind);
    },
    [fxOn],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: copy[language],
      fxOn,
      ambientOn,
      toggleFx,
      toggleAmbient,
      play,
    }),
    [language, setLanguage, fxOn, ambientOn, toggleFx, toggleAmbient, play],
  );

  return (
    <MotionConfig reducedMotion="user">
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </MotionConfig>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProviders");
  }
  return ctx;
}
