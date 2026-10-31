// Animate the layer, never the authored rotation or the interactive content inside it.
export function revealInvitationElement(element: HTMLElement): Animation[] {
  if (!element.animate) return [];
  const role = element.dataset.element,
    art = element.closest<HTMLElement>(".flyer-surface")?.dataset.art;
  const image = role === "image",
    icon = role === "icon",
    title = !!element.dataset.title;
  const side = art === "editorial" || art === "fiesta";
  const frames: Keyframe[] = image
    ? [
        { opacity: 0, clipPath: "inset(12% 0 12% 0)", scale: "1.08" },
        { opacity: 1, clipPath: "inset(0% 0 0% 0)", scale: "1" },
      ]
    : icon
      ? [
          { opacity: 0, scale: ".65", rotate: "-12deg" },
          { opacity: 1, scale: "1", rotate: "0deg" },
        ]
      : [
          {
            opacity: 0,
            translate: side && title ? "-36px 0" : "0 36px",
            clipPath: title ? "inset(0 0 100% 0)" : "inset(0)",
            scale: title ? ".97" : "1",
          },
          { opacity: 1, translate: "0 0", clipPath: "inset(0)", scale: "1" },
        ];
  const animations = [
    element.animate(frames, {
      duration: image ? 1800 : title ? 1450 : 1100,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "backwards",
    }),
  ];
  element
    .querySelectorAll<HTMLElement>(".dress-excluded-color")
    .forEach((swatch, n) =>
      animations.push(
        swatch.animate(
          [
            { opacity: 0, translate: "0 18px", rotate: "-7deg" },
            { opacity: 1, translate: "0 0", rotate: "0deg" },
          ],
          {
            duration: 1000,
            delay: 400 + n * 130,
            fill: "backwards",
            easing: "cubic-bezier(.16,1,.3,1)",
          },
        ),
      ),
    );
  return animations;
}
