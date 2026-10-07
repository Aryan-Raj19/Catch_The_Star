import { motion, AnimatePresence } from "framer-motion";
import { Star, Timer, Heart } from "lucide-react";
import { GAME_CONFIG } from "../constants/gameConfig";

/**
 * Heads-up display: score, goal progress bar, and countdown timer.
 * Timer turns red and shakes in the final TIMER_WARNING seconds.
 */
const HUD = ({ score, timeLeft }) => {
  const isWarning = timeLeft <= GAME_CONFIG.TIMER_WARNING;
  const progress = Math.min((score / GAME_CONFIG.GOAL) * 100, 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-2 flex flex-col gap-2">
      {/* Top row: score | timer */}
      <div className="flex justify-between items-center">
        {/* Score */}
        <div className="flex items-center gap-2 backdrop-blur-sm bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
          <Star size={16} className="text-yellow-300" fill="currentColor" />
          <span
            className="text-white font-bold text-sm"
            style={{ fontFamily: "Dosis, sans-serif" }}
          >
            {score} / {GAME_CONFIG.GOAL}
          </span>
        </div>

        {/* Timer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.2, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-2 backdrop-blur-sm border rounded-full px-4 py-1.5 ${
              isWarning
                ? "bg-red-900/40 border-red-400/50 shake"
                : "bg-white/5 border-white/10"
            }`}
          >
            <Timer
              size={16}
              className={isWarning ? "text-red-400" : "text-pink-300"}
            />
            <span
              className={`font-bold text-sm ${isWarning ? "text-red-300" : "text-white"}`}
              style={{ fontFamily: "Dosis, sans-serif" }}
            >
              {timeLeft}s
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(to right, #b11a70, #ed66b2, #ffcdea)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Goal label */}
      <div className="flex justify-center">
        <span
          className="text-white/40 text-xs"
          style={{ fontFamily: "Dosis, sans-serif" }}
        >
          Catch {GAME_CONFIG.GOAL} stars to unlock the final message
        </span>
      </div>
    </div>
  );
};

export default HUD;