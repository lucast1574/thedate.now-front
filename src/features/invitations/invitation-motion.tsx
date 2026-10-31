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
    const animations: Animation[] = [];
    const animateSection = (section: HTMLElement) => {
      section
        .querySelectorAll<HTMLElement>(".flyer-element")
        .forEach((element, index) => {
          if (!element.animate) return;
          const image = !!element.querySelector("img"),
            icon = !!element.querySelector("svg");
          animations.push(
            element.animate(
              [
                {
                  opacity: 0,
                  translate: `0 ${image ? 28 : icon ? 8 : 18}px`,
                  scale: image ? ".97" : "1",
                },
                { opacity: 1, translate: "0 0", scale: "1" },
              ],
              {
                duration: image ? 1400 : 1000,
                delay: Math.min(index * 85, 650),
                easing: "cubic-bezier(.16,1,.3,1)",
              },
            ),
          );
        });
    };
    function setup() {
      observer?.disconnect();
      animations.splice(0).forEach((animation) => animation.cancel());
      for (const item of items) item.removeAttribute("data-reveal");
      if (reduced.matches || !view || !("IntersectionObserver" in view)) return;
      observer = new view.IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (
              !entry.isIntersecting ||
              root?.querySelector(".invitation-opening")
            )
              continue;
            (entry.target as HTMLElement).dataset.reveal = "visible";
            animateSection(entry.target as HTMLElement);
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
    const openingObserver = new MutationObserver(() => {
      if (!root.querySelector(".invitation-opening")) {
        setup();
        openingObserver.disconnect();
      }
    });
    openingObserver.observe(root, { childList: true, subtree: true });
    setup();
    reduced.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      openingObserver.disconnect();
      animations.forEach((animation) => animation.cancel());
      reduced.removeEventListener("change", setup);
      for (const item of items) item.removeAttribute("data-reveal");
    };
  }, []);
  return <span ref={marker} hidden aria-hidden="true" />;
}
