let context: AudioContext | null = null;
let ambientTrack: HTMLAudioElement | null = null;
let ambientPlayPromise: Promise<AmbientPlaybackResult> | null = null;
let ambientAttempt = 0;
let ambientEnabled = false;
let ambientHasPlayed = false;

export type AmbientPlaybackResult = "playing" | "ready" | "error" | "off";

function getContext() {
  if (typeof window === "undefined") return null;
  if (!context) {
    const AudioCtx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    context = new AudioCtx();
  }
  return context;
}

async function resume() {
  const ctx = getContext();
  if (ctx && ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx;
}

function getAmbientTrack() {
  if (typeof window === "undefined") return null;
  if (!ambientTrack) {
    ambientTrack = new Audio("/sounds/diwali-background.mp3");
    ambientTrack.preload = "auto";
    ambientTrack.loop = true;
    ambientTrack.volume = 0.45;
    ambientTrack.addEventListener("playing", () => {
      ambientHasPlayed = true;
    });
    ambientTrack.addEventListener("pause", () => {
      if (ambientEnabled && ambientHasPlayed && !ambientPlayPromise) {
        void startAmbient();
      }
    });
    ambientTrack.addEventListener("ended", () => {
      if (ambientEnabled && ambientHasPlayed && !ambientPlayPromise) {
        void startAmbient();
      }
    });
    ambientTrack.addEventListener("error", () => {
      console.error("Unable to load /sounds/diwali-background.mp3.");
    });
  }
  return ambientTrack;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  start = 0,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.03);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + start + duration,
  );
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

export type SoundFx = "diya" | "firework" | "open" | "wish" | "gift";

let fireworkVoice: HTMLAudioElement | null = null;
let fireworkSourceUnavailable = false;

function markFireworkSourceUnavailable() {
  if (fireworkSourceUnavailable) return;
  fireworkSourceUnavailable = true;
  console.error("Unable to load /sounds/firecracker.wav.");
}

export function preloadFireworkSound() {
  if (typeof window === "undefined" || fireworkSourceUnavailable) return;
  if (fireworkVoice) return;

  fireworkVoice = new Audio("/sounds/firecracker.wav");
  fireworkVoice.preload = "auto";
  fireworkVoice.volume = 0.5;
  fireworkVoice.addEventListener("error", markFireworkSourceUnavailable);
  fireworkVoice.load();
}

export function playFireworkSound() {
  if (fireworkSourceUnavailable) return;
  preloadFireworkSound();
  if (!fireworkVoice) return;

  fireworkVoice.currentTime = 0;
  void fireworkVoice.play().catch((error: unknown) => {
    console.error("Unable to play /sounds/firecracker.wav.", error);
  });
}

export function stopFireworkSound() {
  fireworkVoice?.pause();
  if (fireworkVoice) fireworkVoice.currentTime = 0;
}

export function disposeFireworkSound() {
  if (!fireworkVoice) return;

  fireworkVoice.removeEventListener("error", markFireworkSourceUnavailable);
  fireworkVoice.pause();
  fireworkVoice.removeAttribute("src");
  fireworkVoice.load();
  fireworkVoice = null;
  fireworkSourceUnavailable = false;
}

export async function playFx(kind: SoundFx) {
  if (kind === "firework") {
    playFireworkSound();
    return;
  }

  const ctx = await resume();
  if (!ctx) return;
  if (kind === "diya") {
    tone(ctx, 392, 0.45, "sine", 0.07);
    tone(ctx, 523.25, 0.5, "triangle", 0.04, 0.05);
  } else if (kind === "open") {
    tone(ctx, 330, 0.3, "sine", 0.05);
    tone(ctx, 495, 0.4, "triangle", 0.04, 0.08);
  } else if (kind === "wish") {
    tone(ctx, 523.25, 0.5, "sine", 0.05);
    tone(ctx, 659.25, 0.6, "triangle", 0.04, 0.1);
    tone(ctx, 783.99, 0.7, "sine", 0.03, 0.18);
  } else {
    tone(ctx, 261.63, 0.2, "triangle", 0.05);
    tone(ctx, 349.23, 0.35, "sine", 0.04, 0.08);
    tone(ctx, 523.25, 0.5, "sine", 0.05, 0.16);
  }
}

export async function startAmbient() {
  const track = getAmbientTrack();
  if (!track) return "error";
  ambientEnabled = true;
  if (ambientPlayPromise) return ambientPlayPromise;
  if (!track.paused && !track.ended) return "playing";
  if (track.error) {
    console.error("Unable to load /sounds/diwali-background.mp3.", track.error);
    return "error";
  }
  const attempt = ++ambientAttempt;
  ambientPlayPromise = (async () => {
    try {
      if (track.ended) track.currentTime = 0;
      await track.play();
      return attempt === ambientAttempt && !track.paused ? "playing" : "off";
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError" &&
        attempt !== ambientAttempt
      ) {
        return "off";
      }
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        return "ready";
      }
      console.error("Unable to play /sounds/diwali-background.mp3.", error);
      return "error";
    } finally {
      if (attempt === ambientAttempt) ambientPlayPromise = null;
    }
  })();

  return ambientPlayPromise;
}

export function stopAmbient() {
  ambientEnabled = false;
  const pendingPlay = ambientPlayPromise !== null;
  ambientAttempt += 1;
  ambientPlayPromise = null;
  if (!ambientTrack) return;
  if (!pendingPlay && ambientTrack.paused && ambientTrack.currentTime === 0) {
    return;
  }
  ambientTrack.pause();
  ambientTrack.currentTime = 0;
}
