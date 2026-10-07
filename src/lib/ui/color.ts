export type HSV = { h: number; s: number; v: number };
export function normalizeColor(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const hex = value.trim().replace(/^#/, "");
  if (/^[\da-f]{3}$/i.test(hex))
    return `#${hex
      .split("")
      .map((c) => c + c)
      .join("")}`.toUpperCase();
  return /^[\da-f]{6}$/i.test(hex) ? `#${hex.toUpperCase()}` : null;
}
export function hsvToHex({ h, s, v }: HSV): string {
  const hue = (((h % 360) + 360) % 360) / 60;
  const c = Math.max(0, Math.min(1, v)) * Math.max(0, Math.min(1, s));
  const x = c * (1 - Math.abs((hue % 2) - 1)),
    m = Math.max(0, Math.min(1, v)) - c;
  const rgb = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(hue)];
  return `#${rgb
    .map((n) =>
      Math.round((n + m) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
}
export function hexToHsv(value: string): HSV {
  const color = normalizeColor(value) || "#000000";
  const [r, g, b] = [1, 3, 5].map(
    (at) => parseInt(color.slice(at, at + 2), 16) / 255,
  );
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  const h = !d
    ? 0
    : max === r
      ? ((g - b) / d) % 6
      : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
}
export function recentColors(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(value.map(normalizeColor).filter((c): c is string => !!c)),
  ].slice(0, 12);
}
export function rememberColor(colors: string[], value: string): string[] {
  const color = normalizeColor(value);
  return color ? recentColors([color, ...colors]) : recentColors(colors);
}
export const weddingColors = [
  "#AD7254",
  "#D49A89",
  "#E6C6B0",
  "#C1A363",
  "#75846C",
  "#3C5146",
  "#F5EFE4",
  "#27251F",
];
export const partyColors = [
  "#8150C7",
  "#B26DEA",
  "#ED5FAD",
  "#FA7851",
  "#F3C65B",
  "#38B7AE",
  "#246CDA",
  "#20192F",
];

export function colorAdjustmentKey(key: string) {
  return [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    "PageUp",
    "PageDown",
  ].includes(key);
}
