"use client";
import { useEffect, useRef } from "react";
import Brand from "@/components/brand";
import Icon from "@/components/icon";
export default function BrandEntrance({
  wedding = false,
}: {
  wedding?: boolean;
}) {
  const storageKey = wedding
    ? "wedding-brand-entrance-v1"
    : "event-brand-entrance-v1";
  const root = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const element = root.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || location.hash || preference.matches) return;
    try {
      if (sessionStorage.getItem(storageKey) && !started.current) return;
      sessionStorage.setItem(storageKey, "seen");
    } catch {
      /* Private browsing still gets a finite, dismissible entrance. */
    }
    started.current = true;
    element.hidden = false;
    const main = element.closest("main");
    if (main) main.dataset.entrance = "active";
    const dismiss = () => {
      element.hidden = true;
      if (main) delete main.dataset.entrance;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") dismiss();
    };
    const timer = setTimeout(dismiss, 1850);
    window.addEventListener("keydown", onKey);
    preference.addEventListener("change", dismiss);
    return () => {
      clearTimeout(timer);
      dismiss();
      window.removeEventListener("keydown", onKey);
      preference.removeEventListener("change", dismiss);
    };
  }, [storageKey]);
  return (
    <div
      ref={root}
      hidden
      className={`brand-entrance ${wedding ? "entrance-wedding" : "entrance-event"}`}
    >
      <div className="brand-entrance-art" aria-hidden="true">
        <span className="entrance-frame entrance-frame-one" />
        <span className="entrance-frame entrance-frame-two" />
        <div className="brand-entrance-logo">
          <Brand wedding={wedding} />
        </div>
        <p className="brand-entrance-caption">
          {wedding
            ? "El comienzo de su gran historia."
            : "Una invitación. Mil posibilidades."}
        </p>
        <span className="brand-entrance-line" />
      </div>
      <button
        type="button"
        className="brand-entrance-skip"
        onClick={() => {
          if (root.current) {
            root.current.hidden = true;
            const main = root.current.closest("main");
            if (main) delete main.dataset.entrance;
          }
        }}
      >
        Entrar al sitio <Icon name="arrow" />
      </button>
    </div>
  );
}
