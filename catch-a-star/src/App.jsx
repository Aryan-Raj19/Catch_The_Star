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
    heartsCaught,
    timeLeft,
    caughtReasons,
    lastCaughtReason,
    lastStarPenalty,
    catchCollectible,
    startGame,
    retryGame,
  } = useGameLoop({ playSound: play });

  useEffect(() => {
    return () => destroyAll();
  }, [destroyAll]);

  const handleStart = () => {
    startMusic();
    startGame();
  };

  const handleRetry = () => {
    startMusic();
    retryGame();
  };

  // useEffect(() => {
  //   if (phase === "won" || phase === "lost") {
  //     stopMusic();
  //   }
  // }, [phase, stopMusic]);

  return (
    <div className="relative w-screen h-screen">
      <FallingBackground />

      {phase !== "idle" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="fixed top-3 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm border border-white/10 bg-white/5 text-pink-300 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>
      )}

      <AnimatePresence mode="wait">

        {phase === "idle" && (
          <StartScreen key="start" onStart={handleStart} />
        )}

        {phase === "playing" && (
          <div key="game" className="relative w-full h-full">
            <HUD
              heartsCaught={heartsCaught}
              timeLeft={timeLeft}
              lastStarPenalty={lastStarPenalty}
            />

            {collectibles.map((collectible) => (
              <Star
                key={collectible.id}
                collectible={collectible}
                onCatch={catchCollectible}
              />
            ))}

            <LoveReasonCard
              key={lastCaughtReason}
              reason={lastCaughtReason}
            />
          </div>
        )}

        {phase === "won" && (
          <WinScreen
            key="win"
            caughtReasons={caughtReasons}
            onReplay={handleRetry}
          />
        )}

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