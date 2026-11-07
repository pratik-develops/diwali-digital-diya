"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  type AmbientPlaybackResult,
  type SoundFx,
} from "@/lib/audio";
import { copy, type Copy } from "@/lib/i18n";
import { useStoredJson } from "@/lib/storage";
import type { Language } from "@/lib/types";

type SoundSettings = {
  fxOn: boolean;
  ambientOn: boolean;
};

const DEFAULT_SOUND: SoundSettings = { fxOn: false, ambientOn: true };

type AppContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Copy;
  fxOn: boolean;
  ambientOn: boolean;
  ambientPlayback: AmbientPlaybackResult;
  touchAnimationsOn: boolean;
  toggleFx: () => void;
  toggleAmbient: () => void;
  toggleTouchAnimations: () => void;
  setTouchAnimations: (enabled: boolean) => void;
  play: (kind: SoundFx) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useStoredJson<Language>(
    "diya-lang",
    "en",
  );
  const [sound, setSound] = useStoredJson("diya-sound", DEFAULT_SOUND);
  const ambientOn =
    typeof sound.ambientOn === "boolean" ? sound.ambientOn : true;
  const [ambientPlayback, setAmbientPlayback] =
    useState<AmbientPlaybackResult>("ready");
  const ambientRequestRef = useRef(0);
  const [touchAnimationsOn, setTouchAnimationsOn] = useStoredJson(
    "diya-touch-animations",
    false,
  );
  const fxOn = sound.fxOn;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.lang = language;
  }, [language]);

  useEffect(() => {
    if (!ambientOn) {
      ambientRequestRef.current += 1;
      stopAmbient();
      return;
    }

    let active = true;
    const startAfterInteraction = () => {
      const request = ++ambientRequestRef.current;
      void startAmbient().then((result) => {
        if (!active || request !== ambientRequestRef.current) return;
        setAmbientPlayback(result);
        if (result === "playing") {
          window.removeEventListener("pointerdown", startAfterInteraction);
          window.removeEventListener("keydown", startAfterInteraction);
        }
      });
    };

    window.addEventListener("pointerdown", startAfterInteraction);
    window.addEventListener("keydown", startAfterInteraction);
    startAfterInteraction();

    return () => {
      active = false;
      ambientRequestRef.current += 1;
      window.removeEventListener("pointerdown", startAfterInteraction);
      window.removeEventListener("keydown", startAfterInteraction);
    };
  }, [ambientOn]);

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
    setSound((prev) => ({ ...prev, fxOn: !prev.fxOn }));
  }, [fxOn, setSound]);

  const toggleAmbient = useCallback(() => {
    const next = !ambientOn;
    if (next) {
      const request = ++ambientRequestRef.current;
      setAmbientPlayback("ready");
      void startAmbient().then((result) => {
        if (request === ambientRequestRef.current) {
          setAmbientPlayback(result);
        }
      });
    } else {
      ambientRequestRef.current += 1;
      stopAmbient();
      setAmbientPlayback("off");
    }
    setSound((prev) => ({ ...prev, ambientOn: next }));
  }, [ambientOn, setSound]);

  const toggleTouchAnimations = useCallback(() => {
    setTouchAnimationsOn((current) => !current);
  }, [setTouchAnimationsOn]);

  const setTouchAnimations = useCallback(
    (enabled: boolean) => setTouchAnimationsOn(enabled),
    [setTouchAnimationsOn],
  );

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
      ambientPlayback,
      touchAnimationsOn,
      toggleFx,
      toggleAmbient,
      toggleTouchAnimations,
      setTouchAnimations,
      play,
    }),
    [
      language,
      setLanguage,
      fxOn,
      ambientOn,
      ambientPlayback,
      touchAnimationsOn,
      toggleFx,
      toggleAmbient,
      toggleTouchAnimations,
      setTouchAnimations,
      play,
    ],
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
