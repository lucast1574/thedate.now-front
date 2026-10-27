import type { FlyerElement } from "./flyer";
import type { DesignSection } from "./types";
export function validDesignDressColors(sections: DesignSection[]) {
  return sections.every(
    (section) =>
      !section.canvas?.elements.some(
        (item) =>
          item.binding === "dress_code" &&
          !validDressColors(item.dressExcludedColors),
      ),
  );
}
export function validDressColors(colors: FlyerElement["dressExcludedColors"]) {
  return (
    !colors ||
    (colors.length <= 8 &&
      colors.every(
        (rule) =>
          rule.name.trim().length > 0 &&
          [...rule.name].length <= 40 &&
          /^#[a-f0-9]{6}$/i.test(rule.color),
      ))
  );
}
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
