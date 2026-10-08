import { motion } from "framer-motion";
import { GAME_CONFIG } from "../constants/gameConfig";

const LoseScreen = ({ heartsCaught, onRetry }) => {
  const encouraging = [
    "So close! The hearts believe in you 💫",
    "Almost! Try once more, you've got this ❤️",
    "The hearts are waiting to be caught 🌟",
    "Don't give up — the final message is worth it 💌",
  ];
  const message = encouraging[Math.floor(Math.random() * encouraging.length)];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center gap-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <motion.span
        className="text-6xl md:text-7xl"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⏰
      </motion.span>

      {/* Message */}
      <div className="flex flex-col gap-3">
        <h1
          className="text-3xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          Time's up!
        </h1>
        <p
          className="text-pink-300 text-lg"
          style={{ fontFamily: "Dosis, sans-serif" }}
        >
          {message}
        </p>
      </div>

      {/* Heart progress recap */}
      <div
        className="rounded-2xl border border-pink-400/20 backdrop-blur-md px-8 py-5 flex flex-col gap-2"
        style={{ background: "rgba(177, 26, 112, 0.1)" }}
      >
        <p
          className="text-white/60 text-sm"
          style={{ fontFamily: "Dosis, sans-serif" }}
        >
          Hearts caught
        </p>
        <p
          className="text-white text-4xl font-bold"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          {heartsCaught} / {GAME_CONFIG.HEART_GOAL}
        </p>
        <p
          className="text-pink-300 text-sm"
          style={{ fontFamily: "Dosis, sans-serif" }}
        >
          {GAME_CONFIG.HEART_GOAL - heartsCaught} more hearts needed to unlock the message
        </p>
      </div>

      {/* Retry */}
      <motion.button
        onClick={onRetry}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="pulse-glow px-10 py-4 rounded-full font-bold text-white text-lg cursor-pointer border border-pink-400/40"
        style={{
          background: "linear-gradient(135deg, #b11a70, #ed66b2)",
          fontFamily: "Dosis, sans-serif",
        }}
      >
        Try Again ❤️
      </motion.button>
    </motion.div>
  );
};

export default LoseScreen;