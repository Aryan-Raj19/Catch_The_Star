// Central config — tweak these to adjust difficulty feel

export const GAME_CONFIG = {
  // Goal: how many stars she must catch to win
  GOAL: 10,

  // Timer: total seconds she has
  TIME_LIMIT: 20,

  // How many stars are alive on screen at once (max)
  MAX_STARS_ON_SCREEN: 70,

  // How often a new star spawns (ms) — decreases as score goes up
  SPAWN_INTERVAL_BASE: 120,   // start: new star every 1.2s
  SPAWN_INTERVAL_MIN: 40,     // floor: never faster than 0.4s

  // How long a star stays on screen before disappearing (ms)
  STAR_LIFETIME_BASE: 2500,    // start: 3.5s to catch it
  STAR_LIFETIME_MIN: 1500,     // floor: never less than 1.5s

  // Fall speed range (px/s) — increases as score goes up
  FALL_SPEED_BASE: { min: 100,  max: 200 },
  FALL_SPEED_MAX:  { min: 180, max: 400 },

  // Star size range (px)
  STAR_SIZE: { min: 28, max: 58 },

  // Warning threshold: timer turns red below this many seconds
  TIMER_WARNING: 10,

  // Difficulty ramp: every N stars caught, game gets harder
  DIFFICULTY_RAMP_EVERY: 2,
};