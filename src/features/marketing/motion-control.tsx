"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/icon";
export default function MotionControl() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return (
    <button
      ref={button}
      type="button"
      className="marketing-motion-control"
      aria-pressed={paused}
      disabled={reduced}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        const root = button.current?.closest("main");
        if (root) root.dataset.motion = next ? "paused" : "full";
      }}
    >
      <Icon name={paused || reduced ? "play" : "pause"} />
      {reduced
        ? "Movimiento reducido"
        : paused
          ? "Activar animaciones"
          : "Pausar animaciones"}
    </button>
  );
}
