let context: AudioContext | null = null;
let ambientNodes: { stop: () => void } | null = null;

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

function noiseBurst(ctx: AudioContext, duration: number, volume: number) {
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = "bandpass";
  filter.frequency.value = 900 + Math.random() * 1400;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
}

export type SoundFx = "diya" | "firework" | "open" | "wish" | "gift";

export async function playFx(kind: SoundFx) {
  const ctx = await resume();
  if (!ctx) return;
  if (kind === "diya") {
    tone(ctx, 392, 0.45, "sine", 0.07);
    tone(ctx, 523.25, 0.5, "triangle", 0.04, 0.05);
  } else if (kind === "firework") {
    noiseBurst(ctx, 0.35, 0.12);
    tone(ctx, 220 + Math.random() * 180, 0.25, "sawtooth", 0.03);
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
  const ctx = await resume();
  if (!ctx || ambientNodes) return;

  const master = ctx.createGain();
  master.gain.value = 0.03;
  master.connect(ctx.destination);

  const notes = [261.63, 329.63, 392.0, 523.25, 587.33];
  const oscillators: OscillatorNode[] = [];

  notes.forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = index % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = frequency / 2;
    gain.gain.value = 0.15;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08 + index * 0.03;
    lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain).connect(gain.gain);
    osc.connect(gain).connect(master);
    osc.start();
    lfo.start();
    oscillators.push(osc, lfo);
  });

  ambientNodes = {
    stop: () => {
      oscillators.forEach((node) => {
        try {
          node.stop();
        } catch {
          /* already stopped */
        }
      });
      master.disconnect();
    },
  };
}

export function stopAmbient() {
  ambientNodes?.stop();
  ambientNodes = null;
}
