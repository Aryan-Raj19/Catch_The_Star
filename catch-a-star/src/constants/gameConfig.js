export const GAME_CONFIG = {
  // Hearts needed to win (only hearts count toward goal)
  HEART_GOAL: 10,

  // Probability a spawned collectible is a heart (rest are stars)
  // 0.1 = 10% hearts, 90% stars → approximately 10:1 ratio
  HEART_PROBABILITY: 0.1,

  // Timer: total seconds she has
  TIME_LIMIT: 25,

  // How many collectibles are alive on screen at once (max)
  MAX_STARS_ON_SCREEN: 25,

  // How often a new collectible spawns (ms) — decreases as hearts go up
  SPAWN_INTERVAL_BASE: 300,   // start: new item every .3s
  SPAWN_INTERVAL_MIN: 100,     // floor: never faster than 0.1s

  // How long a collectible stays on screen before disappearing (ms)
  STAR_LIFETIME_BASE: 3000,    // start: 3s to catch it
  STAR_LIFETIME_MIN: 1500,     // floor: never less than 1.5s

  // Fall speed range (px/s) — increases as hearts go up
  FALL_SPEED_BASE: { min: 100,  max: 200 },
  FALL_SPEED_MAX:  { min: 180, max: 400 },

  // Collectible size range (px)
  STAR_SIZE: { min: 28, max: 58 },

  // Warning threshold: timer turns red below this many seconds
  TIMER_WARNING: 10,

  // Difficulty ramp: every N hearts caught, game gets harder
  DIFFICULTY_RAMP_EVERY: 2,

  // Score floor — display score never goes below this
  SCORE_MIN: 0,
};