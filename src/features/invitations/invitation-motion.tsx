"use client";
import { useEffect, useRef } from "react";
import { revealInvitationElement } from "./invitation-reveal";
export default function InvitationMotion() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>(".invitation"),
      view = root?.ownerDocument.defaultView;
    if (!root || !view) return;
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
    let reveal: IntersectionObserver | undefined,
      ambient: IntersectionObserver | undefined;
    const seen = new Set<Element>(),
      observed = new Set<Element>(),
      animations = new Set<Animation>();
    function collect() {
      if (
        reduced.matches ||
        root!.querySelector(".invitation-opening") ||
        !reveal ||
        !ambient
      )
        return;
      root!
        .querySelectorAll<HTMLElement>(
          ".flyer-element, .invite-content > h1, .invite-content > p, .invite-section > *, .invite-gallery img, .invite-footer",
        )
        .forEach((el) => {
          if (observed.has(el)) return;
          observed.add(el);
          reveal!.observe(el);
        });
      root!
        .querySelectorAll<HTMLElement>(".flyer-surface")
        .forEach((el) => ambient!.observe(el));
    }
    function reset() {
      reveal?.disconnect();
      ambient?.disconnect();
      animations.forEach((a) => a.cancel());
      animations.clear();
      seen.clear();
      observed.clear();
      root!
        .querySelectorAll("[data-scene-active]")
        .forEach((e) => e.removeAttribute("data-scene-active"));
      if (reduced.matches || !view || !("IntersectionObserver" in view)) return;
      reveal = new view.IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (
              !entry.isIntersecting ||
              seen.has(entry.target) ||
              root!.querySelector(".invitation-opening")
            )
              continue;
            seen.add(entry.target);
            reveal!.unobserve(entry.target);
            revealInvitationElement(entry.target as HTMLElement).forEach(
              (a) => {
                animations.add(a);
                a.onfinish = () => {
                  animations.delete(a);
                  a.cancel();
                };
              },
            );
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
      );
      ambient = new view.IntersectionObserver(
        (entries) =>
          entries.forEach((entry) =>
            entry.target.toggleAttribute(
              "data-scene-active",
              entry.isIntersecting,
            ),
          ),
        { threshold: 0.01 },
      );
      collect();
    }
    const changes = new MutationObserver(collect);
    changes.observe(root, { childList: true, subtree: true });
    reset();
    reduced.addEventListener("change", reset);
    return () => {
      changes.disconnect();
      reveal?.disconnect();
      ambient?.disconnect();
      animations.forEach((a) => a.cancel());
      reduced.removeEventListener("change", reset);
      root
        .querySelectorAll("[data-scene-active]")
        .forEach((e) => e.removeAttribute("data-scene-active"));
    };
  }, []);
  return <span hidden ref={marker} aria-hidden="true" />;
}
