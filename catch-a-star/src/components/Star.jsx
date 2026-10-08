import { motion } from "framer-motion";

/**
 * A single falling catchable collectible — either a ⭐ star or ❤️ heart.
 *
 * Stars  → common, costs -1 point  → yellow glow
 * Hearts → rare,   gives +1 point  → pink glow
 *
 * onCatch(id, type) is called on click/tap.
 */
const Star = ({ collectible, onCatch }) => {
  const {
    id,
    type,
    leftPercent,
    size,
    fallSpeed,
    lifetime,
    wobbleAmount,
    wobbleDirection,
    emoji,
  } = collectible;

  const isHeart = type === "heart";

  const fallDistance = window.innerHeight + 100;
  const fallDuration = fallDistance / fallSpeed;
  const wobbleX = wobbleAmount * wobbleDirection;

  // Hearts glow pink/red, stars glow yellow — immediately visually distinct
  const glowFilter = isHeart
    ? "drop-shadow(0 0 10px rgba(255, 80, 120, 1))"
    : "drop-shadow(0 0 8px rgba(255, 220, 50, 0.9))";

  const hoverGlow = isHeart
    ? "drop-shadow(0 0 18px rgba(255, 80, 120, 1))"
    : "drop-shadow(0 0 16px rgba(255, 220, 50, 1))";

  return (
    <motion.button
      key={id}
      aria-label={isHeart ? "Catch this heart" : "Watch out — catching stars costs points!"}
      className="absolute z-20 cursor-pointer select-none focus:outline-none"
      style={{
        left: `${leftPercent}%`,
        top: "-60px",
        fontSize: `${size}px`,
        lineHeight: 1,
        background: "none",
        border: "none",
        padding: 0,
        filter: glowFilter,
      }}
      initial={{ y: 0, x: 0, opacity: 0, scale: 0.5, rotate: 0 }}
      animate={{
        y: fallDistance,
        x: [0, wobbleX, 0, -wobbleX, 0],
        opacity: [0, 1, 1, 1, 0.8],
        scale: [0.5, 1, 1, 1, 0.9],
        rotate: isHeart
          ? [0, 15, 0, -15, 0]  // hearts rock more dramatically
          : [0, 10, 0, -10, 0],
      }}
      transition={{
        duration: fallDuration,
        ease: "linear",
        x: { duration: fallDuration, ease: "easeInOut", repeat: Infinity },
        rotate: {
          duration: fallDuration / 2,
          ease: "easeInOut",
          repeat: Infinity,
        },
      }}
      whileHover={{ scale: 1.4, filter: hoverGlow }}
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation();
        onCatch(id, type); // pass BOTH id and type
      }}
    >
      {emoji}
    </motion.button>
  );
};

export default Star;