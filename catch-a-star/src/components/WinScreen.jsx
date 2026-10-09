import { useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "../hooks/useWindowSize";
import { FINAL_MESSAGE } from "../data/loveReasons";

const WinScreen = ({ caughtReasons, onReplay }) => {
  const { width, height } = useWindowSize();

  // Allow scroll on win screen
  useEffect(() => {
    document.body.classList.add("scrollable");
    return () => document.body.classList.remove("scrollable");
  }, []);

  return (
    <>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={220}
        colors={["#b11a70", "#ed66b2", "#ffcdea", "#fff", "#ffd700"]}
        recycle={false}
      />

      <motion.div
        className="relative z-50 min-h-screen flex flex-col items-center px-5 py-16 gap-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Trophy */}
        <motion.span
          className="text-6xl md:text-7xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          🏆
        </motion.span>

        {/* Win title */}
        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1
            className="text-3xl md:text-5xl font-bold text-white mb-2"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            You did it! 🌟
          </h1>
          <p
            className="text-pink-300 text-base md:text-lg"
            style={{ fontFamily: "Dosis, sans-serif" }}
          >
            You caught all the stars — here's your reward
          </p>
        </motion.div>

        {/* Final message card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full max-w-fit rounded-3xl border border-pink-400/30 backdrop-blur-md px-7 py-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(177,26,112,0.2), rgba(74,0,128,0.2))",
            boxShadow: "0 0 40px rgba(177,26,112,0.25)",
          }}
        >
          <p
            className="text-pink-200 text-xl md:text-2xl font-bold mb-5 leading-snug"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            {FINAL_MESSAGE.header}
          </p>
          <p
            className="text-pink-200 text-xl md:text-2xl font-bold mb-5 leading-snug"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            {FINAL_MESSAGE.title}
          </p>
          <p
            className="text-white/80 text-sm md:text-base leading-relaxed whitespace-pre-line"
            style={{ fontFamily: "Dosis, sans-serif" }}
          >
            {FINAL_MESSAGE.body}
          </p>
          <p
            className="text-pink-300 text-lg font-semibold mt-5"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            {FINAL_MESSAGE.sign}
          </p>
        </motion.div>

        {/* Stars she caught */}
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p
            className="text-center text-pink-300 font-bold text-lg mb-4"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            💘 Hearts you caught tonight 💘
          </p>
          <div className="flex flex-col gap-2">
            {caughtReasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.07 }}
                className="flex items-start gap-3 rounded-xl px-4 py-2.5 border border-white/5 bg-white/5"
              >
                <span className="text-yellow-300 text-sm mt-0.5">💝</span>
                <p
                  className="text-white/75 text-sm"
                  style={{ fontFamily: "Dosis, sans-serif" }}
                >
                  {reason}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Replay */}
        <motion.button
          onClick={onReplay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="pulse-glow px-8 py-3 rounded-full font-bold text-white text-base md:text-lg cursor-pointer border border-pink-400/40"
          style={{
            background: "linear-gradient(135deg, #b11a70, #ed66b2)",
            fontFamily: "Dosis, sans-serif",
          }}
        >
          Play Again 💖
        </motion.button>
      </motion.div>
    </>
  );
};

export default WinScreen;