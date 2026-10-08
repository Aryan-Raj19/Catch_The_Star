import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useGameLoop } from "./hooks/useGameLoop";
import { useSound } from "./hooks/useSound";
import FallingBackground from "./components/FallingBackground";
import Star from "./components/Star";
import HUD from "./components/HUD";
import LoveReasonCard from "./components/LoveReasonCard";
import StartScreen from "./components/StartScreen";
import WinScreen from "./components/WinScreen";
import LoseScreen from "./components/LoseScreen";

function App() {
  const {
    play,
    startMusic,
    stopMusic,
    toggleMute,
    isMuted,
    destroyAll,
  } = useSound();

  const {
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
  } = useGameLoop({ playSound: play });

  // Clean up all Howler instances when App unmounts (React StrictMode safe)
  useEffect(() => {
    return () => destroyAll();
  }, [destroyAll]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleStart = () => {
    startMusic(); // music begins only on user interaction
    startGame();
  };

  const handleRetry = () => {
    // Music keeps playing through retry — restart only if it stopped
    startMusic();
    retryGame();
  };

  // Stop music on win/lose screens
  useEffect(() => {
    if (phase === "won" || phase === "lost") {
      stopMusic();
    }
  }, [phase, stopMusic]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Always-present starry background */}
      <FallingBackground />

      {/* Mute / unmute button — visible in all phases except idle start screen */}
      {phase !== "idle" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm border border-white/10 bg-white/5 text-pink-300 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>
      )}

      <AnimatePresence mode="wait">

        {/* ── Start screen ── */}
        {phase === "idle" && (
          <StartScreen key="start" onStart={handleStart} />
        )}

        {/* ── Active game ── */}
        {phase === "playing" && (
          <div key="game" className="relative w-full h-full">
            <HUD
              score={score}
              heartsCaught={heartsCaught}
              timeLeft={timeLeft}
              lastStarPenalty={lastStarPenalty}
            />

            {/* Falling collectibles — stars and hearts */}
            {collectibles.map((collectible) => (
              <Star
                key={collectible.id}
                collectible={collectible}
                onCatch={catchCollectible}
              />
            ))}

            {/* Love reason popup — only appears after a heart is caught */}
            <LoveReasonCard
              key={lastCaughtReason}
              reason={lastCaughtReason}
            />
          </div>
        )}

        {/* ── Win screen ── */}
        {phase === "won" && (
          <WinScreen
            key="win"
            caughtReasons={caughtReasons}
            onReplay={handleRetry}
          />
        )}

        {/* ── Lose screen ── */}
        {phase === "lost" && (
          <LoseScreen
            key="lose"
            heartsCaught={heartsCaught}
            onRetry={handleRetry}
          />
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;