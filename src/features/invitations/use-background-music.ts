import { useEffect, useRef, type RefObject } from "react";
const BACKGROUND_GAIN = 0.25;
type AudioGraph = { element: HTMLAudioElement; context: AudioContext };
export function useBackgroundMusic(
  ref: RefObject<HTMLAudioElement | null>,
  enabled: boolean,
  src?: string,
) {
  const graph = useRef<AudioGraph | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element || !src) return;
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    // Reuse the media source during React's effect replay.
    if (!graph.current || graph.current.element !== element) {
      void graph.current?.context.close().catch(() => {});
      graph.current = null;
      element.volume = BACKGROUND_GAIN;
      if (window.AudioContext) {
        let context: AudioContext | undefined;
        try {
          context = new AudioContext();
          const gain = context.createGain();
          gain.gain.value = BACKGROUND_GAIN;
          const source = context.createMediaElementSource(element);
          source.connect(gain);
          gain.connect(context.destination);
          graph.current = { element, context };
          // GainNode attenuates on devices that ignore media.volume, too.
          element.volume = 1;
        } catch {
          void context?.close().catch(() => {});
        }
      }
    }
    const context = graph.current?.context;
    const document = element.ownerDocument;
    let disposed = false;
    function detach() {
      document.removeEventListener("pointerdown", play, true);
      document.removeEventListener("keydown", keyboard, true);
    }
    const play = () => {
      if (disposed) return;
      // Both calls stay within the trusted gesture when autoplay was blocked.
      void Promise.all([context?.resume(), element.play()])
        .then(() => {
          if (!disposed && (!context || context.state === "running")) detach();
        })
        .catch(() => {});
    };
    function keyboard(event: KeyboardEvent) {
      if (
        !event.repeat &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        event.key !== "Escape"
      )
        play();
    }
    document.addEventListener("pointerdown", play, {
      capture: true,
      passive: true,
    });
    document.addEventListener("keydown", keyboard, true);
    play();
    return () => {
      disposed = true;
      detach();
      element.pause();
      void context?.suspend().catch(() => {});
      closeTimer.current = setTimeout(() => {
        void context?.close().catch(() => {});
        if (graph.current?.context === context) graph.current = null;
      }, 0);
    };
  }, [enabled, ref, src]);
}
