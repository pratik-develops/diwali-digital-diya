export const GAME_DURATION_MS = 60_000;
export const MAX_LEVEL = 4;
export const SCORE_STORAGE_KEY = "demon-slayer-local-scores-v1";

export type DemonKind = "andhkaar" | "krodh" | "lobh" | "mahadark";
export type AchievementId =
  | "first-light"
  | "five-in-a-row"
  | "boss-bane"
  | "bright-star"
  | "kingdom-keeper";

export type DemonDefinition = {
  name: string;
  points: number;
  hits: number;
  lifetimeMs: number;
  speed: number;
  unlockLevel: number;
  weight: number;
  color: string;
  highlight: string;
};

export const DEMONS: Record<DemonKind, DemonDefinition> = {
  andhkaar: {
    name: "Andhkaar",
    points: 10,
    hits: 1,
    lifetimeMs: 7600,
    speed: 8,
    unlockLevel: 1,
    weight: 58,
    color: "#7860dc",
    highlight: "#c5a5ff",
  },
  krodh: {
    name: "Krodh",
    points: 20,
    hits: 2,
    lifetimeMs: 6400,
    speed: 6,
    unlockLevel: 2,
    weight: 25,
    color: "#ed5e67",
    highlight: "#ffb17a",
  },
  lobh: {
    name: "Lobh",
    points: 30,
    hits: 3,
    lifetimeMs: 5600,
    speed: 5,
    unlockLevel: 2,
    weight: 13,
    color: "#27a88c",
    highlight: "#a6f1bc",
  },
  mahadark: {
    name: "Mahadark",
    points: 100,
    hits: 6,
    lifetimeMs: 10_000,
    speed: 3,
    unlockLevel: 3,
    weight: 4,
    color: "#a33b9c",
    highlight: "#ff9ed6",
  },
};

export const ACHIEVEMENTS: {
  id: AchievementId;
  name: string;
  reward: number;
  description: string;
}[] = [
  {
    id: "first-light",
    name: "First Light",
    reward: 25,
    description: "Defeat your first demon",
  },
  {
    id: "five-in-a-row",
    name: "Five in a Row",
    reward: 75,
    description: "Build a five-hit combo",
  },
  {
    id: "boss-bane",
    name: "Boss Bane",
    reward: 100,
    description: "Defeat Mahadark",
  },
  {
    id: "bright-star",
    name: "Bright Star",
    reward: 100,
    description: "Reach 1,000 points",
  },
  {
    id: "kingdom-keeper",
    name: "Kingdom Keeper",
    reward: 80,
    description: "Reach level 3",
  },
];

export type Demon = {
  id: string;
  kind: DemonKind;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  expiresAt: number;
};

export type PowerUps = {
  shieldMs: number;
  multiplierMs: number;
  comboMs: number;
  blastCooldownMs: number;
  shieldCooldownMs: number;
  multiplierCooldownMs: number;
  comboCooldownMs: number;
};

export type GameState = {
  status: "welcome" | "playing" | "paused" | "over";
  sessionId: string;
  player: string;
  score: number;
  timeLeftMs: number;
  elapsedMs: number;
  level: number;
  health: number;
  demonsDefeated: number;
  bossesDefeated: number;
  combo: number;
  lastHitAt: number;
  demons: Demon[];
  achievements: AchievementId[];
  powers: PowerUps;
  notice: string;
};

const emptyPowers = (): PowerUps => ({
  shieldMs: 0,
  multiplierMs: 0,
  comboMs: 0,
  blastCooldownMs: 0,
  shieldCooldownMs: 0,
  multiplierCooldownMs: 0,
  comboCooldownMs: 0,
});

export function initialGameState(): GameState {
  return {
    status: "welcome",
    sessionId: "",
    player: "",
    score: 0,
    timeLeftMs: GAME_DURATION_MS,
    elapsedMs: 0,
    level: 1,
    health: 5,
    demonsDefeated: 0,
    bossesDefeated: 0,
    combo: 0,
    lastHitAt: 0,
    demons: [],
    achievements: [],
    powers: emptyPowers(),
    notice: "",
  };
}

export type GameAction =
  | { type: "start"; player: string; sessionId: string }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "spawn"; demon: Demon }
  | { type: "hit"; id: string; now: number }
  | {
      type: "power";
      power: "blast" | "shield" | "multiplier" | "combo";
      now: number;
    }
  | { type: "tick"; deltaMs: number; now: number }
  | { type: "clear-notice" };

function grantAchievements(state: GameState): GameState {
  const earned: AchievementId[] = [];
  if (state.demonsDefeated >= 1) earned.push("first-light");
  if (state.combo >= 5) earned.push("five-in-a-row");
  if (state.bossesDefeated >= 1) earned.push("boss-bane");
  if (state.score >= 1000) earned.push("bright-star");
  if (state.level >= 3) earned.push("kingdom-keeper");

  const newlyEarned = earned.filter(
    (id) => !state.achievements.includes(id),
  );
  if (newlyEarned.length === 0) return state;

  const reward = newlyEarned.reduce(
    (sum, id) =>
      sum + (ACHIEVEMENTS.find((item) => item.id === id)?.reward ?? 0),
    0,
  );
  const names = newlyEarned
    .map((id) => ACHIEVEMENTS.find((item) => item.id === id)?.name)
    .filter(Boolean)
    .join(" · ");

  return {
    ...state,
    score: state.score + reward,
    achievements: [...state.achievements, ...newlyEarned],
    notice: `Achievement unlocked: ${names} · +${reward}`,
  };
}

function defeatDemon(state: GameState, demon: Demon, now: number): GameState {
  const nextCombo = now - state.lastHitAt <= 2200 ? state.combo + 1 : 1;
  const comboBonus =
    nextCombo > 1
      ? Math.min(60, (nextCombo - 1) * 5) *
        (state.powers.comboMs > 0 ? 2 : 1)
      : 0;
  const points =
    (DEMONS[demon.kind].points + comboBonus) *
    (state.powers.multiplierMs > 0 ? 2 : 1);
  const updated: GameState = {
    ...state,
    score: state.score + points,
    demonsDefeated: state.demonsDefeated + 1,
    bossesDefeated:
      state.bossesDefeated + (demon.kind === "mahadark" ? 1 : 0),
    combo: nextCombo,
    lastHitAt: now,
    notice:
      nextCombo > 1
        ? `${nextCombo} hit combo · +${comboBonus} bonus`
        : `+${points} light points`,
  };
  return grantAchievements(updated);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "start": {
      return {
        ...initialGameState(),
        status: "playing",
        sessionId: action.sessionId,
        player: action.player,
      };
    }
    case "pause":
      return state.status === "playing" ? { ...state, status: "paused" } : state;
    case "resume":
      return state.status === "paused" ? { ...state, status: "playing" } : state;
    case "spawn":
      if (
        state.status !== "playing" ||
        state.demons.length >= 8 ||
        state.demons.some((demon) => demon.id === action.demon.id) ||
        (action.demon.kind === "mahadark" &&
          state.demons.some((demon) => demon.kind === "mahadark"))
      ) {
        return state;
      }
      return { ...state, demons: [...state.demons, action.demon] };
    case "hit": {
      if (state.status !== "playing") return state;
      const demon = state.demons.find((item) => item.id === action.id);
      if (!demon) return state;
      if (demon.hp > 1) {
        return {
          ...state,
          demons: state.demons.map((item) =>
            item.id === action.id ? { ...item, hp: item.hp - 1 } : item,
          ),
          notice: `${DEMONS[demon.kind].name} needs another light strike`,
        };
      }
      const updated = defeatDemon(state, demon, action.now);
      return {
        ...updated,
        demons: state.demons.filter((item) => item.id !== action.id),
      };
    }
    case "power": {
      if (state.status !== "playing") return state;
      if (action.power === "blast") {
        if (state.powers.blastCooldownMs > 0 || state.demons.length === 0) {
          return state;
        }
        let updated: GameState = {
          ...state,
          demons: [],
          powers: { ...state.powers, blastCooldownMs: 12_000 },
        };
        for (const demon of state.demons) {
          updated = defeatDemon(updated, demon, action.now);
        }
        return { ...updated, notice: "Diya Blast! The courtyard shines bright" };
      }
      if (action.power === "shield") {
        if (state.powers.shieldCooldownMs > 0) return state;
        return {
          ...state,
          powers: {
            ...state.powers,
            shieldMs: 8000,
            shieldCooldownMs: 18_000,
          },
          notice: "Golden Shield is protecting the kingdom",
        };
      }
      if (action.power === "multiplier") {
        if (state.powers.multiplierCooldownMs > 0) return state;
        return {
          ...state,
          powers: {
            ...state.powers,
            multiplierMs: 10_000,
            multiplierCooldownMs: 18_000,
          },
          notice: "Light Multiplier active · double points",
        };
      }
      if (state.powers.comboCooldownMs > 0) return state;
      return {
        ...state,
        powers: {
          ...state.powers,
          comboMs: 8000,
          comboCooldownMs: 20_000,
        },
        notice: "Combo Mode active · chain your light strikes",
      };
    }
    case "tick": {
      if (state.status !== "playing") return state;
      const deltaMs = Math.max(0, Math.min(action.deltaMs, 1000));
      const expired = state.demons.filter(
        (demon) => demon.expiresAt <= action.now,
      );
      const survivors = state.demons.filter(
        (demon) => demon.expiresAt > action.now,
      );
      const nextElapsed = Math.min(GAME_DURATION_MS, state.elapsedMs + deltaMs);
      const nextLevel = Math.min(
        MAX_LEVEL,
        Math.floor(nextElapsed / 15_000) + 1,
      );
      const levelsGained = Math.max(0, nextLevel - state.level);
      const levelReward = levelsGained * 100;
      const escapedDamage = state.powers.shieldMs > 0
        ? 0
        : expired.reduce(
            (total, demon) => total + (demon.kind === "mahadark" ? 2 : 1),
            0,
          );
      let updated: GameState = {
        ...state,
        demons: survivors,
        elapsedMs: nextElapsed,
        timeLeftMs: Math.max(0, state.timeLeftMs - deltaMs),
        health: Math.max(0, state.health - escapedDamage),
        level: nextLevel,
        score: state.score + levelReward,
        combo: action.now - state.lastHitAt > 2200 ? 0 : state.combo,
        powers: {
          shieldMs: Math.max(0, state.powers.shieldMs - deltaMs),
          multiplierMs: Math.max(0, state.powers.multiplierMs - deltaMs),
          comboMs: Math.max(0, state.powers.comboMs - deltaMs),
          blastCooldownMs: Math.max(
            0,
            state.powers.blastCooldownMs - deltaMs,
          ),
          shieldCooldownMs: Math.max(
            0,
            state.powers.shieldCooldownMs - deltaMs,
          ),
          multiplierCooldownMs: Math.max(
            0,
            state.powers.multiplierCooldownMs - deltaMs,
          ),
          comboCooldownMs: Math.max(
            0,
            state.powers.comboCooldownMs - deltaMs,
          ),
        },
        notice: levelsGained > 0
          ? `Level ${nextLevel}! +${levelReward} light bonus`
          : state.notice,
      };
      updated = grantAchievements(updated);
      if (levelsGained > 0) {
        updated = {
          ...updated,
          notice: `Level ${nextLevel}! +${levelReward} light bonus`,
        };
      }
      if (updated.health === 0 || updated.timeLeftMs === 0) {
        return { ...updated, status: "over", demons: [] };
      }
      return updated;
    }
    case "clear-notice":
      return state.notice ? { ...state, notice: "" } : state;
  }
}

export type LocalScore = {
  id: string;
  name: string;
  score: number;
  level: number;
  demonsDefeated: number;
  achievement: string;
  createdAt: number;
};

export interface LeaderboardRepository {
  list(): LocalScore[];
  submit(score: LocalScore): { scores: LocalScore[]; saved: boolean };
}

function isLocalScore(value: unknown): value is LocalScore {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    item.name.length <= 20 &&
    Number.isSafeInteger(item.score) &&
    Number(item.score) >= 0 &&
    Number.isInteger(item.level) &&
    Number(item.level) >= 1 &&
    Number(item.level) <= MAX_LEVEL &&
    Number.isInteger(item.demonsDefeated) &&
    Number(item.demonsDefeated) >= 0 &&
    typeof item.achievement === "string" &&
    typeof item.createdAt === "number" &&
    Number.isFinite(item.createdAt)
  );
}

export const localLeaderboard: LeaderboardRepository = {
  list() {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem(SCORE_STORAGE_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed)
        ? parsed.filter(isLocalScore).sort((a, b) => b.score - a.score).slice(0, 10)
        : [];
    } catch {
      return [];
    }
  },
  submit(score) {
    if (!isLocalScore(score) || typeof window === "undefined") {
      return { scores: this.list(), saved: false };
    }
    const scores = this.list();
    if (scores.some((item) => item.id === score.id)) {
      return { scores, saved: true };
    }
    const playerKey = score.name.trim().toLocaleLowerCase();
    const existing = scores.find(
      (item) => item.name.trim().toLocaleLowerCase() === playerKey,
    );
    const updated = existing
      ? score.score > existing.score
        ? scores.map((item) => (item.id === existing.id ? score : item))
        : scores
      : [...scores, score];
    const ranked = updated.sort((a, b) => b.score - a.score).slice(0, 10);
    try {
      window.localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(ranked));
    } catch {
      return { scores, saved: false };
    }
    return { scores: ranked, saved: true };
  },
};

export function createScoreRecord(state: GameState): LocalScore {
  const topAchievement =
    ACHIEVEMENTS.find((item) =>
      state.achievements.includes(item.id),
    )?.name ?? "Festival challenger";
  return {
    id: state.sessionId,
    name: state.player,
    score: state.score,
    level: state.level,
    demonsDefeated: state.demonsDefeated,
    achievement: topAchievement,
    createdAt: Date.now(),
  };
}
