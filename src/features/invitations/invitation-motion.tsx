"use client";
import { useEffect, useRef } from "react";
export default function InvitationMotion() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>(".invitation");
    const view = root?.ownerDocument.defaultView;
    if (!root || !view) return;
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
    const items = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".invite-top, .invite-content > :not(.invite-sections), .invite-sections > *, .invite-footer",
      ),
    );
    let observer: IntersectionObserver | undefined;
    function setup() {
      observer?.disconnect();
      for (const item of items) item.removeAttribute("data-reveal");
      if (reduced.matches || !view || !("IntersectionObserver" in view)) return;
      observer = new view.IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.reveal = "visible";
            observer?.unobserve(entry.target);
          }
        },
        { threshold: 0.05 },
      );
      items.forEach((item, index) => {
        item.dataset.reveal = "pending";
        item.style.setProperty(
          "--reveal-delay",
          `${Math.min(index, 3) * 65}ms`,
        );
        observer?.observe(item);
      });
    }
    setup();
    reduced.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      reduced.removeEventListener("change", setup);
      for (const item of items) item.removeAttribute("data-reveal");
    };
  }, []);
  return <span ref={marker} hidden aria-hidden="true" />;
}
