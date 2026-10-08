import { GAME_CONFIG } from "../constants/gameConfig";

/**
 * Returns a random number between min and max
 */
export const randomBetween = (min, max) =>
  Math.random() * (max - min) + min;

/**
 * Generates a single collectible object.
 * @param {number} heartsCaught - hearts caught so far, used to scale difficulty
 * @param {"star"|"heart"} type - explicit type override; omit to use probability
 */
export const generateCollectible = (heartsCaught, type) => {
  // Determine type by probability if not explicitly provided
  const resolvedType =
    type ?? (Math.random() < GAME_CONFIG.HEART_PROBABILITY ? "heart" : "star");

  const difficulty = Math.floor(heartsCaught / GAME_CONFIG.DIFFICULTY_RAMP_EVERY);

  // Spawn anywhere across 8%–88% of viewport width so items don't clip edges
  const leftPercent = randomBetween(8, 88);

  const size = randomBetween(
    GAME_CONFIG.STAR_SIZE.min,
    GAME_CONFIG.STAR_SIZE.max
  );

  // Scale fall speed with difficulty
  const speedMin = Math.min(
    GAME_CONFIG.FALL_SPEED_BASE.min + difficulty * 10,
    GAME_CONFIG.FALL_SPEED_MAX.min
  );
  const speedMax = Math.min(
    GAME_CONFIG.FALL_SPEED_BASE.max + difficulty * 15,
    GAME_CONFIG.FALL_SPEED_MAX.max
  );
  const fallSpeed = randomBetween(speedMin, speedMax);

  // Scale lifetime (shorter = harder to catch)
  const lifetime = Math.max(
    GAME_CONFIG.STAR_LIFETIME_BASE - difficulty * 200,
    GAME_CONFIG.STAR_LIFETIME_MIN
  );

  // Wobble: collectible drifts left/right slightly as it falls
  const wobbleAmount = randomBetween(20, 60);
  const wobbleDirection = Math.random() > 0.5 ? 1 : -1;

  // Emoji based on type
  // Hearts: single emoji for clear distinction
  // Stars: variety of star emojis
  const starEmojis = ["⭐", "🌟", "✨", "💫"];
  const heartEmojis = ["❤️", "💖", "💘", "💝", "💗"];
  const emoji =
    resolvedType === "heart"
      ? heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
      : starEmojis[Math.floor(Math.random() * starEmojis.length)];

  return {
    id: `collectible-${Date.now()}-${Math.random()}`,
    type: resolvedType,      // "star" | "heart"
    leftPercent,
    size,
    fallSpeed,
    lifetime,
    wobbleAmount,
    wobbleDirection,
    emoji,
    createdAt: Date.now(),
  };
};

/**
 * Picks a random love reason that hasn't been shown yet this session.
 * Falls back to random if all have been shown.
 */
export const pickLoveReason = (reasons, shownIndices) => {
  const available = reasons
    .map((r, i) => ({ reason: r, index: i }))
    .filter(({ index }) => !shownIndices.includes(index));

  if (available.length === 0) {
    const i = Math.floor(Math.random() * reasons.length);
    return { reason: reasons[i], index: i };
  }

  const picked = available[Math.floor(Math.random() * available.length)];
  return { reason: picked.reason, index: picked.index };
};

/**
 * Calculates spawn interval based on hearts caught — gets faster over time.
 */
export const getSpawnInterval = (heartsCaught) => {
  const difficulty = Math.floor(heartsCaught / GAME_CONFIG.DIFFICULTY_RAMP_EVERY);
  return Math.max(
    GAME_CONFIG.SPAWN_INTERVAL_BASE - difficulty * 80,
    GAME_CONFIG.SPAWN_INTERVAL_MIN
  );
};