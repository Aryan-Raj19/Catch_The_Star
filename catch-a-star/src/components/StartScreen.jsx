import { motion } from "framer-motion";
import { GAME_CONFIG } from "../constants/gameConfig";

const StartScreen = ({ onStart }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center gap-3"
      >
        <motion.span
          className="text-7xl md:text-8xl pb-7"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          💗
        </motion.span>
        <h1
          className="text-4xl md:text-6xl font-bold text-white"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          💖 Catch The Hearts 💖
        </h1>
        <p
          className="text-pink-300 text-lg md:text-xl"
          style={{ fontFamily: "Dosis, sans-serif" }}
        >
          ❤️ Tere liye ek pyara sa chota sa game ❤️
        </p>
      </motion.div>

      {/* Rules card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full max-w-fit rounded-2xl border border-pink-400/20 backdrop-blur-md px-6 py-5 text-left flex flex-col gap-3"
        style={{ background: "rgba(177, 26, 112, 0.1)" }}
      >
        <p
          className="text-pink-200 font-extrabold text-center text-2xl mb-1"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          💘 Kuch faltu ke rules 💘
        </p>
        {[
          `🌚  To aasman se hearts and stars dono drop honge`,
          `💖  Tujhe bus HEARTS catch krne h`,
          `⭐  STARS ko catch kiya to -1`,
          `🎯  And ${GAME_CONFIG.HEART_GOAL} HEARTS pe ek secret message unlock hoga`,
          `⏱️  Aur pura din nhi h bus ${GAME_CONFIG.TIME_LIMIT} secs, to stay focused bubu!`,
          `🔥  Game easy nhi h betu so go on🫡`,
        ].map((rule, i) => (
          <p
            key={i}
            className="text-white/80 text-sm md:text-base"
            style={{ fontFamily: "Dosis, sans-serif" }}
          >
            {rule}
          </p>
        ))}
      </motion.div>

      {/* Start button */}
      <motion.button
        onClick={onStart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="pulse-glow px-7 py-4 rounded-full font-bold text-white text-lg md:text-xl cursor-pointer border border-pink-400/40"
        style={{
          background: "linear-gradient(135deg, #b11a70, #ed66b2)",
          fontFamily: "Dosis, sans-serif",
        }}
      >
        😘 Let's Go Meli Kuchu Puchu 😘
      </motion.button>
    </motion.div>
  );
};

export default StartScreen;