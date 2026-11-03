"use client";

import {
  Award,
  Check,
  Copy,
  Crown,
  Download,
  Flame,
  Heart,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Shield,
  Sparkles,
  Sun,
  Swords,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import {
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { copyText, downloadNodePng } from "@/lib/download";
import {
  ACHIEVEMENTS,
  DEMONS,
  createScoreRecord,
  gameReducer,
  initialGameState,
  localLeaderboard,
  type Demon,
  type DemonKind,
  type GameAction,
  type LocalScore,
} from "@/lib/demon-slayer";
import { playFx } from "@/lib/audio";
import styles from "./DemonSlayerGame.module.css";

const STARS = Array.from({ length: 42 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 53 + 7) % 64}%`,
  delay: `${(index * 17) % 40 / 10}s`,
  size: `${index % 5 === 0 ? 3 : 2}px`,
}));

type Projectile = { id: string; x: number; y: number };
type Challenge = { name: string; score: number };

function freshSessionId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function pickDemon(level: number): DemonKind {
  const options = Object.entries(DEMONS).filter(
    ([, definition]) => definition.unlockLevel <= level,
  ) as [DemonKind, (typeof DEMONS)[DemonKind]][];
  const totalWeight = options.reduce(
    (total, [, definition]) => total + definition.weight,
    0,
  );
  let choice = Math.random() * totalWeight;
  for (const [kind, definition] of options) {
    choice -= definition.weight;
    if (choice < 0) return kind;
  }
  return "andhkaar";
}

function createDemon(level: number, activeDemons: Demon[] = []): Demon {
  const kind = pickDemon(level);
  const definition = DEMONS[kind];
  const maxHp = definition.hits;
  const boss = kind === "mahadark";
  let x = 50;
  let y = 50;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    x = 8 + Math.random() * (boss ? 76 : 82);
    y = 24 + Math.random() * 48;
    const spacing = boss ? 17 : 13;
    if (
      !activeDemons.some(
        (demon) =>
          Math.abs(demon.x - x) < spacing &&
          Math.abs(demon.y - y) < (boss ? 18 : 13),
      )
    ) {
      break;
    }
  }
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    kind,
    x,
    y,
    hp: maxHp,
    maxHp,
    expiresAt: Date.now() + Math.max(4000, definition.lifetimeMs - (level - 1) * 350),
  };
}

function DemonSprite({
  demon,
  onAttack,
}: {
  demon: Demon;
  onAttack: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const definition = DEMONS[demon.kind];
  const boss = demon.kind === "mahadark";
  return (
    <button
      type="button"
      className={`${styles.demon} ${styles[demon.kind]}`}
      onClick={onAttack}
      style={
        {
          left: `${demon.x}%`,
          top: `${demon.y}%`,
          "--demon-color": definition.color,
          "--demon-highlight": definition.highlight,
          "--demon-speed": `${definition.speed}s`,
        } as CSSProperties
      }
      aria-label={`${definition.name}, ${demon.hp} of ${demon.maxHp} light strikes remaining. Tap to attack.`}
    >
      {boss ? (
        <span className={styles.bossBar} aria-hidden="true">
          <span style={{ width: `${(demon.hp / demon.maxHp) * 100}%` }} />
        </span>
      ) : null}
      <svg
        className={styles.demonArt}
        viewBox="0 0 100 112"
        role="img"
        aria-label={`${definition.name} shadow sprite`}
      >
        <defs>
          <radialGradient id={`glow-${demon.id}`}>
            <stop stopColor={definition.highlight} stopOpacity=".75" />
            <stop offset="1" stopColor={definition.color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`skin-${demon.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={definition.highlight} />
            <stop offset=".52" stopColor={definition.color} />
            <stop offset="1" stopColor="#341746" />
          </linearGradient>
        </defs>
        <ellipse
          cx="50"
          cy="60"
          rx="49"
          ry="50"
          fill={`url(#glow-${demon.id})`}
        />
        <path
          d={boss ? "M17 37 7 11 31 25 38 7 52 24 72 8 69 29 94 18 82 44" : "M22 39 12 13 37 28 45 12 55 27 77 13 72 38 89 29 79 53"}
          fill={definition.color}
          stroke={definition.highlight}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d={boss ? "M23 56c0-22 12-32 28-32s29 12 29 33v12c0 25-12 34-30 34S21 92 21 70Z" : "M25 57c0-18 10-28 25-28s26 11 26 29v12c0 19-10 27-26 27S24 87 24 69Z"}
          fill={`url(#skin-${demon.id})`}
          stroke="#ffe0a6"
          strokeOpacity=".78"
          strokeWidth="2.5"
        />
        <path d="M37 59q5-6 10 0" fill="none" stroke="#fff1d2" strokeWidth="3" strokeLinecap="round" />
        <path d="M55 59q5-6 10 0" fill="none" stroke="#fff1d2" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="42" cy="63" rx="3" ry="4" fill="#fff5c3" />
        <ellipse cx="60" cy="63" rx="3" ry="4" fill="#fff5c3" />
        <path
          d="M42 77q8 8 16 0"
          fill="none"
          stroke="#3b1735"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M34 88q16 12 32 0l8 13H26Z" fill="#371944" opacity=".8" />
        <circle cx="32" cy="73" r="2" fill={definition.highlight} />
        <circle cx="68" cy="73" r="2" fill={definition.highlight} />
        {boss ? (
          <>
            <path d="M43 32 50 17l7 15M28 45 17 34M73 44 84 33" fill="none" stroke="#ffe298" strokeWidth="3" strokeLinecap="round" />
            <path d="m50 41 3 6-3 6-3-6Z" fill="#ffe59a" />
          </>
        ) : null}
      </svg>
      <span className={styles.demonName}>{definition.name}</span>
      <span className={styles.demonPoints}>
        {demon.hp < demon.maxHp ? `${demon.hp} strikes left` : `${definition.points} pts`}
      </span>
    </button>
  );
}

function LocalLeaderboard({
  scores,
  compact = false,
}: {
  scores: LocalScore[];
  compact?: boolean;
}) {
  return (
    <div className={styles.leaderboard} aria-live="polite">
      {scores.length === 0 ? (
        <p className={styles.emptyBoard}>
          Your name could be the first on this device&apos;s leaderboard.
        </p>
      ) : (
        <ol>
          {scores.slice(0, compact ? 3 : 10).map((score, index) => (
            <li key={score.id}>
              <span className={styles.rank}>#{index + 1}</span>
              <span className={styles.playerRank}>
                <strong>{score.name}</strong>
                <small>{score.achievement}</small>
              </span>
              <span className={styles.scoreRank}>
                {score.score.toLocaleString()}
                <small>Level {score.level}</small>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function DemonSlayerGame() {
  const [game, reduceGame] = useReducer(gameReducer, undefined, initialGameState);
  const [nickname, setNickname] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const [projectile, setProjectile] = useState<Projectile | null>(null);
  const [burst, setBurst] = useState<Projectile | null>(null);
  const [blastActive, setBlastActive] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [scores, setScores] = useState<LocalScore[]>([]);
  const [message, setMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const arenaRef = useRef<HTMLDivElement>(null);
  const scorecardRef = useRef<HTMLDivElement>(null);
  const shotTimeoutRef = useRef<number | null>(null);
  const burstTimeoutRef = useRef<number | null>(null);
  const blastTimeoutRef = useRef<number | null>(null);
  const savedSessionRef = useRef("");
  const gameRef = useRef(game);

  const dispatch = useCallback(
    (action: GameAction) => {
      const previous = gameRef.current;
      const next = gameReducer(previous, action);
      gameRef.current = next;
      reduceGame(action);
      if (
        previous.status !== "over" &&
        next.status === "over" &&
        next.sessionId &&
        savedSessionRef.current !== next.sessionId
      ) {
        savedSessionRef.current = next.sessionId;
        const result = localLeaderboard.submit(createScoreRecord(next));
        setScores(result.scores);
        if (!result.saved) {
          setSaveMessage("Your score could not be saved in this browser.");
        }
      }
    },
    [reduceGame],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setScores(localLeaderboard.list());
      const params = new URLSearchParams(window.location.search);
      const challenger = (params.get("challenge") ?? "").trim().slice(0, 20);
      const challengeScore = Number(params.get("score"));
      if (
        challenger &&
        Number.isSafeInteger(challengeScore) &&
        challengeScore >= 0
      ) {
        setChallenge({ name: challenger, score: challengeScore });
      }
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (game.status !== "playing") return;
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") dispatch({ type: "pause" });
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [dispatch, game.status]);

  useEffect(() => {
    if (game.status !== "playing") return;
    let previous = performance.now();
    const intervalId = window.setInterval(() => {
      const now = performance.now();
      const deltaMs = now - previous;
      previous = now;
      dispatch({ type: "tick", deltaMs, now: Date.now() });
    }, 250);
    return () => window.clearInterval(intervalId);
  }, [dispatch, game.status]);

  useEffect(() => {
    if (game.status !== "playing") return;
    const intervalId = window.setInterval(
      () =>
        dispatch({
          type: "spawn",
          demon: createDemon(game.level, gameRef.current.demons),
        }),
      Math.max(650, 1500 - game.level * 180),
    );
    return () => window.clearInterval(intervalId);
  }, [dispatch, game.level, game.status]);

  useEffect(() => {
    if (!game.notice) return;
    const timeoutId = window.setTimeout(
      () => dispatch({ type: "clear-notice" }),
      2400,
    );
    return () => window.clearTimeout(timeoutId);
  }, [dispatch, game.notice]);

  useEffect(
    () => () => {
      if (shotTimeoutRef.current !== null) {
        window.clearTimeout(shotTimeoutRef.current);
      }
      if (burstTimeoutRef.current !== null) {
        window.clearTimeout(burstTimeoutRef.current);
      }
      if (blastTimeoutRef.current !== null) {
        window.clearTimeout(blastTimeoutRef.current);
      }
    },
    [],
  );

  const startGame = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const player = nickname.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 20);
    if (!player) {
      setMessage("Enter a nickname before entering the kingdom.");
      return;
    }
    setNickname(player);
    setMessage("");
    setSaveMessage("");
    savedSessionRef.current = "";
    dispatch({ type: "start", player, sessionId: freshSessionId() });
  };

  const restartGame = () => {
    if (!game.player) return;
    savedSessionRef.current = "";
    setSaveMessage("");
    dispatch({
      type: "start",
      player: game.player,
      sessionId: freshSessionId(),
    });
  };

  const attack = (demon: Demon, event: MouseEvent<HTMLButtonElement>) => {
    const arena = arenaRef.current;
    if (arena) {
      const bounds = arena.getBoundingClientRect();
      const target = event.currentTarget.getBoundingClientRect();
      setProjectile({
        id: `${demon.id}-${event.timeStamp}`,
        x: ((target.left + target.width / 2 - bounds.left) / bounds.width) * 100,
        y: ((target.top + target.height / 2 - bounds.top) / bounds.height) * 100,
      });
      if (shotTimeoutRef.current !== null) {
        window.clearTimeout(shotTimeoutRef.current);
      }
      shotTimeoutRef.current = window.setTimeout(() => setProjectile(null), 360);
      if (gameRef.current.demons.find((item) => item.id === demon.id)?.hp === 1) {
        setBurst({
          id: `${demon.id}-burst`,
          x: ((target.left + target.width / 2 - bounds.left) / bounds.width) * 100,
          y: ((target.top + target.height / 2 - bounds.top) / bounds.height) * 100,
        });
        if (burstTimeoutRef.current !== null) {
          window.clearTimeout(burstTimeoutRef.current);
        }
        burstTimeoutRef.current = window.setTimeout(() => setBurst(null), 520);
      }
    }
    dispatch({
      type: "hit",
      id: demon.id,
      now: performance.timeOrigin + event.timeStamp,
    });
    if (soundOn) void playFx("diya");
  };

  const activatePower = (
    power: "blast" | "shield" | "multiplier" | "combo",
  ) => {
    if (power === "blast" && gameRef.current.demons.length > 0) {
      setBlastActive(true);
      if (blastTimeoutRef.current !== null) {
        window.clearTimeout(blastTimeoutRef.current);
      }
      blastTimeoutRef.current = window.setTimeout(
        () => setBlastActive(false),
        720,
      );
    }
    dispatch({ type: "power", power, now: Date.now() });
    if (soundOn) void playFx(power === "blast" ? "firework" : "diya");
  };

  const summary = `I scored ${game.score.toLocaleString()} points in Demon Slayer: Festival of Light! Can you beat me? I reached level ${game.level} and defeated ${game.demonsDefeated} demons.`;
  const challengeUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/game?challenge=${encodeURIComponent(game.player)}&score=${game.score}`
      : "";
  const shareText = `${summary} ${challengeUrl}`;

  const copySummary = async () => {
    const copied = await copyText(shareText);
    setMessage(
      copied
        ? "Challenge copied — send it to a friend!"
        : "Could not copy the challenge. Please select and copy it manually.",
    );
  };

  const shareChallenge = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Demon Slayer: Festival of Light",
          text: summary,
          url: challengeUrl,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    const copied = await copyText(shareText);
    setMessage(
      copied
        ? "Sharing is unavailable here, so your challenge was copied instead."
        : "Could not share or copy the challenge in this browser.",
    );
  };

  const downloadScorecard = async () => {
    if (!scorecardRef.current) return;
    try {
      await downloadNodePng(scorecardRef.current, "festival-of-light-scorecard.png");
      setMessage("Your scorecard is ready to share!");
    } catch {
      setMessage("Could not create the scorecard image. Please try again.");
    }
  };

  const visibleTime = Math.ceil(game.timeLeftMs / 1000);
  const timerLabel = `${Math.floor(visibleTime / 60)}:${String(visibleTime % 60).padStart(2, "0")}`;

  return (
    <section className={styles.page}>
      <div className={styles.sky} aria-hidden="true">
        {STARS.map((star, index) => (
          <span
            key={index}
            className={styles.star}
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              width: star.size,
              height: star.size,
            }}
          />
        ))}
        <span className={`${styles.cloud} ${styles.cloudOne}`} />
        <span className={`${styles.cloud} ${styles.cloudTwo}`} />
      </div>

      <div className={styles.wrap}>
        <div className={styles.pageHeading}>
          <p className={styles.eyebrow}>
            <Sparkles size={14} /> A FESTIVAL ARCADE ADVENTURE
          </p>
          <h1>
            DEMON SLAYER <span>·</span> FESTIVAL OF LIGHT
          </h1>
          <p>
            Bring the kingdom back to light. Tap the shadows, protect the
            courtyard, and see how bright you can shine.
          </p>
        </div>

        {challenge ? (
          <div className={styles.challengeBanner}>
            <Trophy size={18} />
            <span>
              <strong>{challenge.name}</strong> scored{" "}
              <strong>{challenge.score.toLocaleString()}</strong> points. Can
              you beat their festival score?
            </span>
            <button type="button" onClick={() => setChallenge(null)} aria-label="Dismiss challenge">
              ×
            </button>
          </div>
        ) : null}

        {game.status === "welcome" ? (
          <>
            <div className={styles.welcomeGrid}>
              <div className={styles.welcomeCard}>
                <div className={styles.welcomeArt} aria-hidden="true">
                  <span className={styles.moon} />
                  <span className={styles.welcomeLantern}>🏮</span>
                  <span className={styles.welcomeDiya}>🪔</span>
                  <span className={styles.welcomeSparkle}>✦</span>
                  <span className={styles.welcomeSparkleTwo}>✧</span>
                </div>
                <p className={styles.eyebrow}>THE KINGDOM NEEDS YOUR LIGHT</p>
                <h2>Light up the night.</h2>
                <p className={styles.welcomeCopy}>
                  Mischievous shadow sprites have wandered into the Diwali
                  courtyard. Tap them with magical light before they slip away.
                </p>
                <form className={styles.startForm} onSubmit={startGame}>
                  <label htmlFor="game-nickname">Your festival nickname</label>
                  <input
                    id="game-nickname"
                    name="nickname"
                    autoComplete="nickname"
                    maxLength={20}
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    placeholder="e.g. StarryDiya"
                    required
                  />
                  <button className={styles.primaryButton} type="submit">
                    <Play size={18} fill="currentColor" /> Play Game
                  </button>
                  {message ? <p className={styles.formMessage}>{message}</p> : null}
                </form>
              </div>

              <aside className={styles.infoCard}>
                <h3>
                  <Sparkles size={18} /> Your light guide
                </h3>
                <ul className={styles.demonGuide}>
                  {(Object.entries(DEMONS) as [DemonKind, (typeof DEMONS)[DemonKind]][]).map(
                    ([kind, demon]) => (
                      <li key={kind}>
                        <span
                          className={styles.guideOrb}
                          style={{ background: demon.color, boxShadow: `0 0 16px ${demon.color}` }}
                        />
                        <span>
                          <strong>{demon.name}</strong>
                          <small>
                            {demon.hits > 1
                              ? `${demon.hits} light strikes`
                              : "A quick tap"}
                          </small>
                        </span>
                        <b>+{demon.points}</b>
                      </li>
                    ),
                  )}
                </ul>
                <div className={styles.tip}>
                  <Swords size={16} />
                  <span>Chain quick hits for combo points. Missed shadows dim your health.</span>
                </div>
                <div className={styles.powerPreview}>
                  <span><Sun size={15} /> Diya Blast</span>
                  <span><Shield size={15} /> Golden Shield</span>
                  <span><Zap size={15} /> Light Multiplier</span>
                  <span><Flame size={15} /> Combo Mode</span>
                </div>
              </aside>
            </div>

            <section id="leaderboard" className={styles.boardSection}>
              <div className={styles.sectionTitle}>
                <div>
                  <p className={styles.eyebrow}>ON THIS DEVICE ONLY</p>
                  <h2><Trophy size={21} /> Local Hall of Light</h2>
                </div>
                <span>Scores stay in this browser</span>
              </div>
              <LocalLeaderboard scores={scores} />
            </section>
          </>
        ) : null}

        {game.status === "playing" || game.status === "paused" ? (
          <div className={styles.gamePanel}>
            <div className={styles.hud}>
              <div className={styles.hudItem}>
                <span className={styles.hudIcon}><Trophy size={17} /></span>
                <span><small>SCORE</small><strong>{game.score.toLocaleString()}</strong></span>
              </div>
              <div className={styles.hudItem}>
                <span className={styles.hudIcon}><Crown size={17} /></span>
                <span><small>LEVEL</small><strong>{game.level}<i>/4</i></strong></span>
              </div>
              <div className={styles.hudItem}>
                <span className={styles.hudIcon}><Heart size={17} /></span>
                <span><small>LIGHT</small><strong className={styles.healthIcons} aria-label={`${game.health} health remaining`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Heart key={index} size={15} fill={index < game.health ? "currentColor" : "transparent"} />
                  ))}
                </strong></span>
              </div>
              <div className={`${styles.hudItem} ${visibleTime <= 10 ? styles.timerWarning : ""}`}>
                <span className={styles.hudIcon}><Timer size={17} /></span>
                <span><small>TIME</small><strong>{timerLabel}</strong></span>
              </div>
              <div className={styles.hudActions}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setSoundOn((value) => !value)}
                  aria-pressed={soundOn}
                  aria-label={soundOn ? "Mute game sounds" : "Enable game sounds"}
                  title={soundOn ? "Mute game sounds" : "Enable game sounds"}
                >
                  {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => dispatch({ type: game.status === "playing" ? "pause" : "resume" })}
                  aria-label={game.status === "playing" ? "Pause game" : "Resume game"}
                >
                  {game.status === "playing" ? <Pause size={18} /> : <Play size={18} />}
                </button>
              </div>
            </div>

            <div
              ref={arenaRef}
              className={`${styles.arena} ${game.status === "paused" ? styles.arenaPaused : ""}`}
              style={{ backgroundImage: "url('/illustrations/demon-slayer-palace.svg')" }}
            >
              <div className={styles.arenaTopline}>
                <span><Sparkles size={14} /> {game.player}&apos;s kingdom</span>
                <span>{game.demonsDefeated} shadows lit</span>
              </div>
              <div className={`${styles.protection} ${game.powers.shieldMs > 0 ? styles.protected : ""}`}>
                {game.powers.shieldMs > 0 ? <><Shield size={15} /> Golden Shield · {Math.ceil(game.powers.shieldMs / 1000)}s</> : null}
              </div>
              {game.demons.map((demon) => (
                <DemonSprite
                  key={demon.id}
                  demon={demon}
                  onAttack={(event) => attack(demon, event)}
                />
              ))}
              {projectile ? (
                <span
                  key={projectile.id}
                  className={styles.projectile}
                  style={
                    {
                      "--shot-x": `${projectile.x}%`,
                      "--shot-y": `${projectile.y}%`,
                    } as CSSProperties
                  }
                  aria-hidden="true"
                />
              ) : null}
              {burst ? (
                <span
                  key={burst.id}
                  className={styles.hitBurst}
                  style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
                  aria-hidden="true"
                >
                  <i>✦</i><i>✧</i><i>✦</i><i>✧</i>
                </span>
              ) : null}
              {blastActive ? <span className={styles.blastFlash} aria-hidden="true" /> : null}
              {game.combo >= 2 ? (
                <div className={styles.comboBadge} aria-live="polite">
                  <Flame size={16} /> {game.combo}× LIGHT COMBO
                </div>
              ) : null}
              {game.notice.startsWith("Level ") ? (
                <div className={styles.levelCelebration} role="status">
                  <span className={styles.levelSparkle}><Sparkles size={21} /></span>
                  <small>THE COURTYARD SHINES BRIGHTER</small>
                  <strong>Level {game.level - 1} complete!</strong>
                  <span>Level {game.level} unlocked · +100 light bonus</span>
                </div>
              ) : game.notice ? (
                <div className={styles.notice} role="status">{game.notice}</div>
              ) : null}
              <div className={styles.arenaPrompt} aria-hidden="true">TAP A SHADOW TO SHINE</div>

              {game.status === "paused" ? (
                <div className={styles.pauseOverlay}>
                  <div className={styles.pauseCard}>
                    <span className={styles.pauseIcon}><Pause size={22} /></span>
                    <p className={styles.eyebrow}>TAKE A BREATH</p>
                    <h2>Your kingdom is safe.</h2>
                    <p>Game time and shadow movement are paused until you return.</p>
                    <button className={styles.primaryButton} type="button" onClick={() => dispatch({ type: "resume" })}>
                      <Play size={17} fill="currentColor" /> Resume game
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className={styles.powerBar}>
              <PowerButton
                label="Diya Blast"
                detail="Clear all shadows"
                icon={<Sun size={18} />}
                cooldown={game.powers.blastCooldownMs}
                disabled={game.demons.length === 0}
                onClick={() => activatePower("blast")}
              />
              <PowerButton
                label="Golden Shield"
                detail={game.powers.shieldMs > 0 ? `${Math.ceil(game.powers.shieldMs / 1000)}s protection` : "Block escapes"}
                icon={<Shield size={18} />}
                cooldown={game.powers.shieldCooldownMs}
                active={game.powers.shieldMs > 0}
                onClick={() => activatePower("shield")}
              />
              <PowerButton
                label="Light Multiplier"
                detail={game.powers.multiplierMs > 0 ? `${Math.ceil(game.powers.multiplierMs / 1000)}s · double points` : "Double your points"}
                icon={<Zap size={18} />}
                cooldown={game.powers.multiplierCooldownMs}
                active={game.powers.multiplierMs > 0}
                onClick={() => activatePower("multiplier")}
              />
              <PowerButton
                label="Combo Mode"
                detail={game.powers.comboMs > 0 ? `${Math.ceil(game.powers.comboMs / 1000)}s · chain hits` : "Bonus for fast hits"}
                icon={<Flame size={18} />}
                cooldown={game.powers.comboCooldownMs}
                active={game.powers.comboMs > 0}
                onClick={() => activatePower("combo")}
              />
            </div>
            <div className={styles.gameFooter}>
              <span><Sparkles size={14} /> {game.demonsDefeated} demons defeated</span>
              <button type="button" onClick={restartGame}><RotateCcw size={14} /> Restart</button>
            </div>
          </div>
        ) : null}

        {game.status === "over" ? (
          <div className={styles.results}>
            <div className={styles.fireworks} aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ left: `${(index * 53 + 7) % 100}%`, "--firework-delay": `${index * 0.13}s`, "--firework-hue": `${(index * 37) % 360}` } as CSSProperties} />)}
            </div>
            <div className={styles.resultsHeading}>
              <span className={styles.resultMedal}><Trophy size={29} /></span>
              <p className={styles.eyebrow}>THE COURTYARD SHINES AGAIN</p>
              <h2>Beautifully done, {game.player}!</h2>
              <p>Your light made this Diwali kingdom brighter.</p>
            </div>

            <div ref={scorecardRef} className={styles.scorecard}>
              <div className={styles.scorecardFlourish} aria-hidden="true">✦　✧　✦</div>
              <p className={styles.eyebrow}>DEMON SLAYER · FESTIVAL OF LIGHT</p>
              <h3>A night worth celebrating</h3>
              <div className={styles.scorecardPlayer}>{game.player}</div>
              <div className={styles.finalScore}>{game.score.toLocaleString()} <span>POINTS</span></div>
              <div className={styles.resultStats}>
                <span><Crown size={16} /><strong>Level {game.level}</strong><small>highest level</small></span>
                <span><Swords size={16} /><strong>{game.demonsDefeated}</strong><small>demons defeated</small></span>
                <span><Award size={16} /><strong>{game.achievements.length}</strong><small>achievements</small></span>
              </div>
              <div className={styles.scorecardAchievements}>
                {game.achievements.length ? (
                  game.achievements.map((id) => (
                    <span key={id}><Check size={13} /> {ACHIEVEMENTS.find((item) => item.id === id)?.name}</span>
                  ))
                ) : (
                  <span><Sparkles size={13} /> Your next achievement is waiting</span>
                )}
              </div>
              <p className={styles.festiveMessage}>
                May your courage glow brighter than a thousand diyas. Keep
                spreading light, {game.player}!
              </p>
              <div className={styles.scorecardFlourish} aria-hidden="true">🪔　✧　🪔</div>
            </div>

            <div className={styles.shareActions}>
              <button type="button" className={styles.primaryButton} onClick={downloadScorecard}>
                <Download size={17} /> Download scorecard
              </button>
              <button type="button" className={styles.secondaryButton} onClick={copySummary}>
                <Copy size={17} /> Copy challenge
              </button>
              <button type="button" className={styles.secondaryButton} onClick={shareChallenge}>
                <Share2 size={17} /> Share score
              </button>
              <a
                className={styles.whatsappButton}
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Share2 size={17} /> WhatsApp
              </a>
            </div>
            {message ? <p className={styles.shareMessage} role="status">{message}</p> : null}
            {saveMessage ? <p className={styles.saveMessage} role="status">{saveMessage}</p> : null}
            <div className={styles.resultActions}>
              <button className={styles.primaryButton} type="button" onClick={restartGame}>
                <RotateCcw size={17} /> Play again
              </button>
              <a className={styles.secondaryButton} href="#leaderboard">
                <Trophy size={17} /> Local leaderboard
              </a>
            </div>
            <section id="leaderboard" className={styles.boardSection}>
              <div className={styles.sectionTitle}>
                <div>
                  <p className={styles.eyebrow}>ON THIS DEVICE ONLY</p>
                  <h2><Trophy size={21} /> Local Hall of Light</h2>
                </div>
                <span>Scores stay in this browser</span>
              </div>
              <LocalLeaderboard scores={scores} />
            </section>
          </div>
        ) : null}

        <p className={styles.storageNote}>
          <span><Check size={14} /> No account needed</span>
          <span><Sparkles size={14} /> Sound is off until you turn it on</span>
          <span><Trophy size={14} /> Leaderboard is saved on this device</span>
        </p>
      </div>
    </section>
  );
}

function PowerButton({
  label,
  detail,
  icon,
  cooldown,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string;
  detail: string;
  icon: ReactNode;
  cooldown: number;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const cooling = cooldown > 0;
  return (
    <button
      type="button"
      className={`${styles.powerButton} ${active ? styles.powerActive : ""} ${cooling ? styles.powerCooling : ""}`}
      disabled={cooling || disabled}
      onClick={onClick}
      aria-label={`${label}: ${cooling ? `ready in ${Math.ceil(cooldown / 1000)} seconds` : detail}`}
    >
      <span className={styles.powerIcon}>{icon}</span>
      <span className={styles.powerText}>
        <strong>{label}</strong>
        <small>{cooling ? `Ready in ${Math.ceil(cooldown / 1000)}s` : detail}</small>
      </span>
      {cooling ? <span className={styles.cooldownTrack}><i style={{ width: `${Math.min(100, (cooldown / 20_000) * 100)}%` }} /></span> : null}
    </button>
  );
}
