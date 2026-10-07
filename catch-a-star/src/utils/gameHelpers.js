import { GAME_CONFIG } from "../constants/gameConfig";

/**
 * Returns a random number between min and max (inclusive)
 */
export const randomBetween = (min, max) =>
  Math.random() * (max - min) + min;

/**
 * Generates a new star object with a unique id and randomised properties.
 * @param {number} score - current caught count, used to scale difficulty
 */
export const generateStar = (score) => {
  const difficulty = Math.floor(score / GAME_CONFIG.DIFFICULTY_RAMP_EVERY);

  // Spawn anywhere across 10%–90% of viewport width so stars don't clip edges
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

  // Wobble amount — stars drift left/right slightly as they fall
  const wobbleAmount = randomBetween(20, 60);
  const wobbleDirection = Math.random() > 0.5 ? 1 : -1;

  // Star emoji variety
  const emojis = ["⭐", "🌟", "✨", "💫"];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  return {
    id: `star-${Date.now()}-${Math.random()}`,
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
    // All shown — pick any random one
    const i = Math.floor(Math.random() * reasons.length);
    return { reason: reasons[i], index: i };
  }

  const picked = available[Math.floor(Math.random() * available.length)];
  return { reason: picked.reason, index: picked.index };
};

/**
 * Calculates spawn interval based on current score — gets faster over time.
 */
export const getSpawnInterval = (score) => {
  const difficulty = Math.floor(score / GAME_CONFIG.DIFFICULTY_RAMP_EVERY);
  return Math.max(
    GAME_CONFIG.SPAWN_INTERVAL_BASE - difficulty * 80,
    GAME_CONFIG.SPAWN_INTERVAL_MIN
  );
};