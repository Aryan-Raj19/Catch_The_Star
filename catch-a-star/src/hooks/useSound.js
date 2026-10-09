import { useRef, useCallback, useState } from "react";
import { Howl, Howler } from "howler";

/**
 * Manages all game audio:
 *   play(name)    — one-shot sound effects (catch, win, lose, tick)
 *   startMusic()  — begins looping background music (safe to call multiple times)
 *   stopMusic()   — stops background music
 *   toggleMute()  — mutes/unmutes everything via Howler global volume
 *   isMuted       — current mute state
 *
 * Place audio files at:
 *   public/sounds/background.mp3
 *   public/sounds/catch.mp3
 *   public/sounds/win.mp3
 *   public/sounds/lose.mp3
 *   public/sounds/tick.mp3
 */
export const useSound = () => {
  const sfx = useRef({});
  const bgMusicRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  // ── One-shot SFX ────────────────────────────────────────────────────────────
  const getSfx = useCallback((name, src, volume = 0.6) => {
    if (!sfx.current[name]) {
      sfx.current[name] = new Howl({ src: [src], volume, html5: true });
    }
    return sfx.current[name];
  }, []);

  // const play = useCallback(
  //   (name) => {
  //     try {
  //       const map = {
  //         catch: () => getSfx("catch", "/sounds/catch.mp3", 0.5),
  //         win:   () => getSfx("win",   "/sounds/win.mp3",   0.7),
  //         lose:  () => getSfx("lose",  "/sounds/lose.mp3",  0.6),
  //         tick:  () => getSfx("tick",  "/sounds/tick.mp3",  0.3),
  //       };
  //       if (map[name]) map[name]().play();
  //     } catch {
  //       // Sound file missing — silently ignore
  //     }
  //   },
  //   [getSfx]
  // );

  const play = useCallback(
    (name) => {
      try {
        const map = {
          catch: () =>
            getSfx(
              "catch",
              "https://res.cloudinary.com/qdtuufkt/video/upload/v1791532382/wow.mp3",
              0.5,
            ),
          win: () =>
            getSfx(
              "win",
              "https://res.cloudinary.com/qdtuufkt/video/upload/v1791532382/clap.mp3",
              0.7,
            ),
          lose: () =>
            getSfx(
              "lose",
              "https://res.cloudinary.com/qdtuufkt/video/upload/v1791532384/bomb.mp3",
              0.6,
            ),
          tick: () =>
            getSfx(
              "tick",
              "https://res.cloudinary.com/qdtuufkt/video/upload/v1791532382/timer.mp3",
              0.3,
            ),

          minus: () => {
            const files = [
              "https://res.cloudinary.com/qdtuufkt/video/upload/v1791532382/spring.mp3",
              "https://res.cloudinary.com/qdtuufkt/video/upload/v1791532381/oh_no.mp3",
            ];

            const file = files[Math.floor(Math.random() * files.length)];

            return getSfx(`minus-${file}`, file, 0.5);
          },
        };

        if (map[name]) map[name]().play();
      } catch {
        // Sound file missing — silently ignore
      }
    },
    [getSfx],
  );

  // ── Background music ────────────────────────────────────────────────────────
  const startMusic = useCallback(() => {
    try {
      // Create Howl instance only once
      if (!bgMusicRef.current) {
        bgMusicRef.current = new Howl({
          src: [
            "https://res.cloudinary.com/qdtuufkt/video/upload/v1791529517/Romantic_Love_Mashup_2025____Arijit_Singh_Love_Songs____Romantic_Songs_2025__cut_2409sec.mp3",
          ],
          loop: true,
          volume: 0.4,
          html5: true,
        });
      }

      // Don't stack multiple plays — only start if not already playing
      if (!bgMusicRef.current.playing()) {
        bgMusicRef.current.play();
      }
    } catch {
      // Missing audio file — silently ignore
    }
  }, []);

  const stopMusic = useCallback(() => {
    try {
      bgMusicRef.current?.stop();
    } catch {
      // ignore
    }
  }, []);

  // ── Mute toggle — uses Howler global mute so it covers everything ───────────
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      Howler.mute(next);
      return next;
    });
  }, []);

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  // (called if App ever unmounts — prevents audio leak in strict mode)
  const destroyAll = useCallback(() => {
    bgMusicRef.current?.unload();
    bgMusicRef.current = null;
    Object.values(sfx.current).forEach((s) => s.unload());
    sfx.current = {};
  }, []);

  return { play, startMusic, stopMusic, toggleMute, isMuted, destroyAll };
};
