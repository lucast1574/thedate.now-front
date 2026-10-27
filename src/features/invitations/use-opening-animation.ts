import { useEffect, useRef, useState } from "react";
import { openingPreset } from "@/lib/events/opening-presets";
import type { Opening } from "@/lib/events/celebration";
export function useOpeningAnimation(style: Opening["style"]) {
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const started = useRef(false);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function open(node: HTMLElement | null) {
    if (started.current) return;
    started.current = true;
    setPhase("opening");
    const reduced = node?.ownerDocument.defaultView?.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    timer.current = setTimeout(
      () => setPhase("done"),
      reduced ? 0 : openingPreset(style).duration,
    );
  }
  function reset() {
    if (timer.current) clearTimeout(timer.current);
    started.current = false;
    setPhase("closed");
  }
  return { phase, open, reset };
}
