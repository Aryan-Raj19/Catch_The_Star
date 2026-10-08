import { useState, useEffect, useRef, useCallback } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";
import { LOVE_REASONS } from "../data/loveReasons";
import { generateCollectible, pickLoveReason, getSpawnInterval } from "../utils/gameHelpers";

/**
 * Core game loop hook.
 *
 * Single counter: heartsCaught
 *   ❤️ heart caught  → +1 (counts toward HEART_GOAL, reveals love message)
 *   ⭐ star caught   → -1 (deducted from the same counter, clamped to 0)
 *
 * Win condition: heartsCaught >= HEART_GOAL
 */
export const useGameLoop = ({ onWin, onLose, playSound }) => {
  const [phase, setPhase] = useState("idle");
  const [collectibles, setCollectibles] = useState([]);
  const [heartsCaught, setHeartsCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.TIME_LIMIT);
  const [caughtReasons, setCaughtReasons] = useState([]);
  const [lastCaughtReason, setLastCaughtReason] = useState(null);
  // Increments every time a star is caught — triggers "-1" shake in HUD
  const [lastStarPenalty, setLastStarPenalty] = useState(0);

  // Refs to avoid stale closures in intervals
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
    heartsCaughtRef.current = 0;
    shownIndicesRef.current = [];
    phaseRef.current = "playing";

    setPhase("playing");
    setCollectibles([]);
    setHeartsCaught(0);
    setTimeLeft(GAME_CONFIG.TIME_LIMIT);
    setCaughtReasons([]);
    setLastCaughtReason(null);
    setLastStarPenalty(0);

    startSpawnLoop();

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

      setCollectibles((prev) => prev.filter((c) => c.id !== collectibleId));

      if (collectibleType === "heart") {
        // ── HEART: +1, reveal message ──────────────────────────────────────────
        const { reason, index } = pickLoveReason(LOVE_REASONS, shownIndicesRef.current);
        shownIndicesRef.current = [...shownIndicesRef.current, index];

        setLastCaughtReason(reason);
        setCaughtReasons((prev) => [...prev, reason]);
        playSound("catch");

        const newHearts = heartsCaughtRef.current + 1;
        heartsCaughtRef.current = newHearts;
        setHeartsCaught(newHearts);

        // Win check
        if (newHearts >= GAME_CONFIG.HEART_GOAL) {
          clearTimers();
          phaseRef.current = "won";
          setPhase("won");
          playSound("win");
          onWin?.();
        }
      } else {
        // ── STAR: -1 from the same heartsCaught counter, floor at 0 ───────────
        playSound("catch");

        const newHearts = Math.max(heartsCaughtRef.current - 1, 0);
        heartsCaughtRef.current = newHearts;
        setHeartsCaught(newHearts);

        // Trigger penalty shake animation in HUD
        setLastStarPenalty((prev) => prev + 1);
      }
    },
    [playSound, onWin]
  );

  // ── Retry / reset ───────────────────────────────────────────────────────────
  const retryGame = useCallback(() => {
    clearTimers();
    phaseRef.current = "idle";
    heartsCaughtRef.current = 0;
    shownIndicesRef.current = [];

    setPhase("idle");
    setCollectibles([]);
    setHeartsCaught(0);
    setTimeLeft(GAME_CONFIG.TIME_LIMIT);
    setCaughtReasons([]);
    setLastCaughtReason(null);
    setLastStarPenalty(0);
  }, []);

  // ── Schedule expiry whenever collectibles change ────────────────────────────
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