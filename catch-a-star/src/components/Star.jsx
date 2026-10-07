import { motion } from "framer-motion";

/**
 * A single catchable falling star.
 * Uses Framer Motion for smooth fall + wobble animation.
 * onClick calls catchStar(id) from the game loop.
 */
const Star = ({ star, onCatch }) => {
  const { id, leftPercent, size, fallSpeed, lifetime, wobbleAmount, wobbleDirection, emoji } = star;

  // How far down it falls: viewport height + a little extra so it fully exits
  const fallDistance = window.innerHeight + 100;

  // Duration to fall that distance at fallSpeed (px/s)
  const fallDuration = fallDistance / fallSpeed;

  // Wobble: the star drifts horizontally as it falls
  const wobbleX = wobbleAmount * wobbleDirection;

  return (
    <motion.button
      key={id}
      aria-label="Catch this star"
      className="absolute z-20 cursor-pointer select-none focus:outline-none"
      style={{
        left: `${leftPercent}%`,
        top: "-60px",
        fontSize: `${size}px`,
        lineHeight: 1,
        background: "none",
        border: "none",
        padding: 0,
        filter: "drop-shadow(0 0 8px rgba(255, 220, 50, 0.9))",
      }}
      initial={{ y: 0, x: 0, opacity: 0, scale: 0.5, rotate: 0 }}
      animate={{
        y: fallDistance,
        x: [0, wobbleX, 0, -wobbleX, 0],
        opacity: [0, 1, 1, 1, 0.8],
        scale: [0.5, 1, 1, 1, 0.9],
        rotate: [0, 10, 0, -10, 0],
      }}
      transition={{
        duration: fallDuration,
        ease: "linear",
        x: { duration: fallDuration, ease: "easeInOut", repeat: Infinity },
        rotate: { duration: fallDuration / 2, ease: "easeInOut", repeat: Infinity },
      }}
      whileHover={{ scale: 1.4, filter: "drop-shadow(0 0 16px rgba(255,220,50,1))" }}
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation();
        onCatch(id);
      }}
    >
      {emoji}
    </motion.button>
  );
};

export default Star;