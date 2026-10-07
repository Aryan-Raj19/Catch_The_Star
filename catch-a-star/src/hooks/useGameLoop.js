import { useState, useEffect, useRef, useCallback } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";
import { LOVE_REASONS } from "../data/loveReasons";
import { generateStar, pickLoveReason, getSpawnInterval } from "../utils/gameHelpers";

/**
 * Core game loop hook — manages all game state so App/GameScreen stays clean.
 *
 * Returns everything the UI needs:
 * - stars, score, timeLeft, phase, caughtReasons
 * - catchStar(id), startGame, retryGame
 */
export const useGameLoop = ({ onWin, onLose, playSound }) => {
  const [phase, setPhase] = useState("idle"); // idle | playing | won | lost
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.TIME_LIMIT);
  const [caughtReasons, setCaughtReasons] = useState([]);
  const [lastCaughtReason, setLastCaughtReason] = useState(null);

  // Refs to avoid stale closures in intervals
  const scoreRef = useRef(0);
  const shownIndicesRef = useRef([]);
  const spawnTimerRef = useRef(null);
  const countdownRef = useRef(null);
  const phaseRef = useRef("idle");

  const clearTimers = () => {
    clearInterval(spawnTimerRef.current);
    clearInterval(countdownRef.current);
  };

  // ── Spawn loop ──────────────────────────────────────────────────────────────
  const startSpawnLoop = useCallback(() => {
    const spawn = () => {
      setStars((prev) => {
        if (prev.length >= GAME_CONFIG.MAX_STARS_ON_SCREEN) return prev;
        return [...prev, generateStar(scoreRef.current)];
      });

      // Re-schedule with updated interval (gets faster as score rises)
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = setTimeout(spawn, getSpawnInterval(scoreRef.current));
    };

    spawnTimerRef.current = setTimeout(spawn, getSpawnInterval(0));
  }, []);

  // ── Remove a star after its lifetime expires ────────────────────────────────
  const scheduleStarExpiry = useCallback((starId, lifetime) => {
    setTimeout(() => {
      if (phaseRef.current !== "playing") return;
      setStars((prev) => prev.filter((s) => s.id !== starId));
    }, lifetime);
  }, []);

  // ── Start game ──────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    // Reset everything
    scoreRef.current = 0;
    shownIndicesRef.current = [];
    phaseRef.current = "playing";

    setPhase("playing");
    setStars([]);
    setScore(0);
    setTimeLeft(GAME_CONFIG.TIME_LIMIT);
    setCaughtReasons([]);
    setLastCaughtReason(null);

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

  // ── Catch a star ────────────────────────────────────────────────────────────
  const catchStar = useCallback(
    (starId) => {
      if (phaseRef.current !== "playing") return;

      // Remove star from screen
      setStars((prev) => prev.filter((s) => s.id !== starId));

      // Pick a love reason
      const { reason, index } = pickLoveReason(LOVE_REASONS, shownIndicesRef.current);
      shownIndicesRef.current = [...shownIndicesRef.current, index];

      setLastCaughtReason(reason);
      setCaughtReasons((prev) => [...prev, reason]);
      playSound("catch");

      // Update score
      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);

      // Check win condition
      if (newScore >= GAME_CONFIG.GOAL) {
        clearTimers();
        phaseRef.current = "won";
        setPhase("won");
        playSound("win");
        onWin?.();
      }
    },
    [playSound, onWin]
  );

  const retryGame = useCallback(() => {
    clearTimers();
    phaseRef.current = "idle";
    setPhase("idle");
    setStars([]);
    setScore(0);
    setTimeLeft(GAME_CONFIG.TIME_LIMIT);
    setCaughtReasons([]);
    setLastCaughtReason(null);
    scoreRef.current = 0;
    shownIndicesRef.current = [];
  }, []);

  // ── Schedule star expiry whenever stars change ──────────────────────────────
  useEffect(() => {
    stars.forEach((star) => {
      scheduleStarExpiry(star.id, star.lifetime);
    });
  }, [stars, scheduleStarExpiry]);

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => clearTimers();
  }, []);

  return {
    phase,
    stars,
    score,
    timeLeft,
    caughtReasons,
    lastCaughtReason,
    catchStar,
    startGame,
    retryGame,
  };
};