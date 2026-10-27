import type { FlyerElement } from "./flyer";
export type DressPart = "icon" | "image" | "text";
export const dressStyles = {
  text: ["text"],
  icon: ["icon"],
  image: ["image"],
  "icon-text": ["icon", "text"],
  "image-text": ["image", "text"],
  "icon-image": ["icon", "image"],
  all: ["icon", "image", "text"],
} as const;
export function dressParts(
  style: FlyerElement["dressStyle"],
): readonly DressPart[] {
  return dressStyles[style || "text"] || dressStyles.text;
}
export function toggleDressPart(
  style: FlyerElement["dressStyle"],
  part: DressPart,
): keyof typeof dressStyles {
  const current = dressParts(style);
  const next = current.includes(part)
    ? current.filter((p) => p !== part)
    : [...current, part];
  return (
    (Object.keys(dressStyles) as (keyof typeof dressStyles)[]).find(
      (key) =>
        dressStyles[key].length === next.length &&
        next.every((p) =>
          (dressStyles[key] as readonly DressPart[]).includes(p),
        ),
    ) ||
    style ||
    "text"
  );
}
