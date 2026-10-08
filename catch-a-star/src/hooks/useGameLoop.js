import { useState, useEffect, useRef, useCallback } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";
import { LOVE_REASONS } from "../data/loveReasons";
import { generateCollectible, pickLoveReason, getSpawnInterval } from "../utils/gameHelpers";

/**
 * Core game loop hook.
 *
 * Tracks:
 *   score         — display score (+1 heart, -1 star, clamped to SCORE_MIN)
 *   heartsCaught  — true progress toward the goal (hearts only)
 *   stars         — all live collectibles on screen (both stars and hearts)
 *
 * Win condition: heartsCaught >= HEART_GOAL
 */
export const useGameLoop = ({ onWin, onLose, playSound }) => {
  const [phase, setPhase] = useState("idle"); // idle | playing | won | lost
  const [collectibles, setCollectibles] = useState([]);
  const [score, setScore] = useState(0);
  const [heartsCaught, setHeartsCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.TIME_LIMIT);
  const [caughtReasons, setCaughtReasons] = useState([]);
  const [lastCaughtReason, setLastCaughtReason] = useState(null);
  // Increments on every star catch to trigger the "-1" feedback in the HUD
  const [lastStarPenalty, setLastStarPenalty] = useState(0);

  // Refs to avoid stale closures in intervals
  const scoreRef = useRef(0);
  const heartsCaughtRef = useRef(0);
  const shownIndicesRef = useRef([]);
  const spawnTimerRef = useRef(null);
  const countdownRef = useRef(null);
  const phaseRef = useRef("idle");

  const clearTimers = () => {
    clearTimeout(spawnTimerRef.current);
    clearInterval(countdownRef.current);
  };

  // ── Spawn loop ──────────────────────────────────────────────────────────────
  const startSpawnLoop = useCallback(() => {
    const spawn = () => {
      setCollectibles((prev) => {
        if (prev.length >= GAME_CONFIG.MAX_STARS_ON_SCREEN) {
          // Still reschedule even if screen is full
          spawnTimerRef.current = setTimeout(spawn, getSpawnInterval(heartsCaughtRef.current));
          return prev;
        }
        return [...prev, generateCollectible(heartsCaughtRef.current)];
      });

      spawnTimerRef.current = setTimeout(spawn, getSpawnInterval(heartsCaughtRef.current));
    };

    spawnTimerRef.current = setTimeout(spawn, getSpawnInterval(0));
  }, []);

  // ── Remove a collectible after its lifetime expires ─────────────────────────
  const scheduleExpiry = useCallback((id, lifetime) => {
    setTimeout(() => {
      if (phaseRef.current !== "playing") return;
      setCollectibles((prev) => prev.filter((c) => c.id !== id));
    }, lifetime);
  }, []);

  // ── Start game ──────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    scoreRef.current = 0;
    heartsCaughtRef.current = 0;
    shownIndicesRef.current = [];
    phaseRef.current = "playing";

    setPhase("playing");
    setCollectibles([]);
    setScore(0);
    setHeartsCaught(0);
    setTimeLeft(GAME_CONFIG.TIME_LIMIT);
    setCaughtReasons([]);
    setLastCaughtReason(null);
    setLastStarPenalty(0);

    startSpawnLoop();

    // Countdown timer
    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimers();
          phaseRef.current = "lost";
          setPhase("lost");
          playSound("lose");
          onLose?.();
          return 0;
        }
        if (prev === GAME_CONFIG.TIMER_WARNING + 1) playSound("tick");
        return prev - 1;
      });
    }, 1000);
  }, [startSpawnLoop, playSound, onLose]);

  // ── Catch a collectible ─────────────────────────────────────────────────────
  const catchCollectible = useCallback(
    (collectibleId, collectibleType) => {
      if (phaseRef.current !== "playing") return;

      // Remove from screen immediately
      setCollectibles((prev) => prev.filter((c) => c.id !== collectibleId));

      if (collectibleType === "heart") {
        // ── HEART: +1 score, +1 progress, reveal message ──────────────────────
        const { reason, index } = pickLoveReason(LOVE_REASONS, shownIndicesRef.current);
        shownIndicesRef.current = [...shownIndicesRef.current, index];

        setLastCaughtReason(reason);
        setCaughtReasons((prev) => [...prev, reason]);
        playSound("catch");

        const newScore = scoreRef.current + 1;
        const newHearts = heartsCaughtRef.current + 1;
        scoreRef.current = newScore;
        heartsCaughtRef.current = newHearts;

        setScore(newScore);
        setHeartsCaught(newHearts);

        // Win check — must be hearts, not total score
        if (newHearts >= GAME_CONFIG.HEART_GOAL) {
          clearTimers();
          phaseRef.current = "won";
          setPhase("won");
          playSound("win");
          onWin?.();
        }
      } else {
        // ── STAR: -1 score, no message, penalty feedback ───────────────────────
        playSound("catch"); // lighter sound; swap for a dedicated "oops" sound if you have one

        const newScore = Math.max(
          scoreRef.current - 1,
          GAME_CONFIG.SCORE_MIN
        );
        scoreRef.current = newScore;
        setScore(newScore);

        // Incrementing this triggers the "-1" shake animation in HUD
        setLastStarPenalty((prev) => prev + 1);
      }
    },
    [playSound, onWin]
  );

  // ── Retry / reset ───────────────────────────────────────────────────────────
  const retryGame = useCallback(() => {
    clearTimers();
    phaseRef.current = "idle";
    scoreRef.current = 0;
    heartsCaughtRef.current = 0;
    shownIndicesRef.current = [];

    setPhase("idle");
    setCollectibles([]);
    setScore(0);
    setHeartsCaught(0);
    setTimeLeft(GAME_CONFIG.TIME_LIMIT);
    setCaughtReasons([]);
    setLastCaughtReason(null);
    setLastStarPenalty(0);
  }, []);

  // ── Schedule expiry whenever collectibles list changes ──────────────────────
  useEffect(() => {
    collectibles.forEach((c) => scheduleExpiry(c.id, c.lifetime));
  }, [collectibles, scheduleExpiry]);

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => clearTimers();
  }, []);

  return {
    phase,
    collectibles,
    score,
    heartsCaught,
    timeLeft,
    caughtReasons,
    lastCaughtReason,
    lastStarPenalty,
    catchCollectible,
    startGame,
    retryGame,
  };
};