import { useRef, useCallback } from "react";
import { Howl } from "howler";

/**
 * Lazily initialises Howl instances so they're only created once.
 * Returns a play(soundName) function.
 *
 * Add .mp3 files to /public/sounds/ — if they're missing the game
 * still works, just silently (Howler handles missing files gracefully).
 */
export const useSound = () => {
  const sounds = useRef({});

  const getSound = useCallback((name, src, volume = 0.6) => {
    if (!sounds.current[name]) {
      sounds.current[name] = new Howl({ src: [src], volume, html5: true });
    }
    return sounds.current[name];
  }, []);

  const play = useCallback(
    (name) => {
      try {
        const map = {
          catch: () => getSound("catch", "/sounds/catch.mp3", 0.5),
          win:   () => getSound("win",   "/sounds/win.mp3",   0.7),
          lose:  () => getSound("lose",  "/sounds/lose.mp3",  0.6),
          tick:  () => getSound("tick",  "/sounds/tick.mp3",  0.3),
        };
        if (map[name]) map[name]().play();
      } catch {
        // Sound missing — silently ignore
      }
    },
    [getSound]
  );

  return { play };
};