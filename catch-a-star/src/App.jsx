import { AnimatePresence } from "framer-motion";
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
  const { play } = useSound();

  const {
    phase,
    stars,
    score,
    timeLeft,
    caughtReasons,
    lastCaughtReason,
    catchStar,
    startGame,
    retryGame,
  } = useGameLoop({ playSound: play });

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Always-present starry background */}
      <FallingBackground />

      <AnimatePresence mode="wait">

        {/* ── Start screen ── */}
        {phase === "idle" && (
          <StartScreen key="start" onStart={startGame} />
        )}

        {/* ── Active game ── */}
        {phase === "playing" && (
          <div key="game" className="relative w-full h-full">
            <HUD score={score} timeLeft={timeLeft} />

            {/* Catchable falling stars */}
            {stars.map((star) => (
              <Star key={star.id} star={star} onCatch={catchStar} />
            ))}

            {/* Love reason popup after each catch */}
            <LoveReasonCard key={lastCaughtReason} reason={lastCaughtReason} />
          </div>
        )}

        {/* ── Win screen ── */}
        {phase === "won" && (
          <WinScreen
            key="win"
            caughtReasons={caughtReasons}
            onReplay={retryGame}
          />
        )}

        {/* ── Lose screen ── */}
        {phase === "lost" && (
          <LoseScreen
            key="lose"
            score={score}
            onRetry={retryGame}
          />
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;