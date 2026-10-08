import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer } from "lucide-react";
import { GAME_CONFIG } from "../constants/gameConfig";

/**
 * HUD — shows:
 *   ❤️ heartsCaught / HEART_GOAL  — single counter (hearts +1, stars -1)
 *   countdown timer               — turns red + shakes in final seconds
 *   progress bar                  — tied to heartsCaught
 *
 * lastStarPenalty increments on every star catch to trigger
 * the "-1" shake on the single hearts counter.
 */
const HUD = ({ heartsCaught, timeLeft, lastStarPenalty }) => {
  const isWarning = timeLeft <= GAME_CONFIG.TIMER_WARNING;
  const progress = Math.min((heartsCaught / GAME_CONFIG.HEART_GOAL) * 100, 100);

  const [showPenalty, setShowPenalty] = useState(false);

  useEffect(() => {
    if (lastStarPenalty === 0) return;
    setShowPenalty(true);
    const t = setTimeout(() => setShowPenalty(false), 700);
    return () => clearTimeout(t);
  }, [lastStarPenalty]);

  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-2 flex flex-col gap-2">

      {/* Top row */}
      <div className="flex justify-between items-center gap-2">

        {/* Single heart counter — shakes on star penalty */}
        <div className="relative flex items-center">
          <motion.div
            key={lastStarPenalty}
            animate={
              showPenalty
                ? {
                    x: [-4, 4, -3, 3, 0],
                    backgroundColor: [
                      "rgba(239,68,68,0.3)",
                      "rgba(255,255,255,0.05)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 backdrop-blur-sm bg-white/5 border border-white/10 rounded-full px-4 py-1.5"
          >
            <span className="text-sm leading-none">❤️</span>
            <span
              className="text-white font-bold text-sm"
              style={{ fontFamily: "Dosis, sans-serif" }}
            >
              {heartsCaught} / {GAME_CONFIG.HEART_GOAL}
            </span>
          </motion.div>

          {/* Floating "-1" on star catch */}
          <AnimatePresence>
            {showPenalty && (
              <motion.span
                key={lastStarPenalty + "label"}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -24 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65 }}
                className="absolute -top-1 right-0 text-red-400 font-bold text-xs pointer-events-none"
                style={{ fontFamily: "Dosis, sans-serif" }}
              >
                -1
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Timer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={timeLeft}
            initial={{ scale: 1.2, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-2 backdrop-blur-sm border rounded-full px-4 mr-15 py-1.5 ${
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
              className={`font-bold text-sm ${
                isWarning ? "text-red-300" : "text-white"
              }`}
              style={{ fontFamily: "Dosis, sans-serif" }}
            >
              {timeLeft}s
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar tied to heartsCaught */}
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

      {/* Hint label */}
      <div className="flex justify-center">
        <span
          className="text-white/40 text-xs"
          style={{ fontFamily: "Dosis, sans-serif" }}
        >
          ❤️ catch hearts · ⭐ avoid stars · {GAME_CONFIG.HEART_GOAL} hearts to win
        </span>
      </div>
    </div>
  );
};

export default HUD;