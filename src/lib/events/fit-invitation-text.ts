import type { FlyerElement } from "./flyer";
// Conservative wrapping estimate shared by generated designs and live bound text.
export function fitInvitationText(item: FlyerElement, value = item.text || "") {
  if (
    item.type !== "text" ||
    !value.trim() ||
    item.binding === "map" ||
    item.binding === "dress_code"
  )
    return item.fontSize;
  const width = item.width,
    height = item.height,
    weight =
      value === value.toLocaleUpperCase()
        ? 0.78
        : item.bold
          ? 0.7
          : item.font === "sans"
            ? 0.62
            : 0.56;
  function fits(size: number) {
    const limit =
      width / (size * (weight + Math.max(0, item.letterSpacing ?? 0)));
    let lines = 0;
    for (const paragraph of value.split("\n")) {
      let used = 0;
      lines++;
      for (const word of paragraph.split(/\s+/)) {
        const length = word.length;
        // A title must fit its longest word, not merely fit split fragments.
        if (length > limit) return false;
        if (used && used + length + 1 > limit) {
          lines++;
          used = 0;
        }
        lines += Math.max(0, Math.ceil(length / limit) - 1);
        used = used ? used + length + 1 : length;
      }
    }
    return lines * size * (item.lineHeight ?? 1.2) <= height;
  }
  let size = item.fontSize;
  while (size > 8 && !fits(size)) size -= 1;
  return Math.max(8, size);
}
