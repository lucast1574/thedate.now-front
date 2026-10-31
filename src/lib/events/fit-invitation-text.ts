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
    weight = item.bold ? 0.64 : item.font === "sans" ? 0.55 : 0.53;
  function fits(size: number) {
    const limit = width / (size * weight);
    let lines = 0;
    for (const paragraph of value.split("\n")) {
      let used = 0;
      lines++;
      for (const word of paragraph.split(/\s+/)) {
        const length = word.length;
        if (used && used + length + 1 > limit) {
          lines++;
          used = 0;
        }
        lines += Math.max(0, Math.ceil(length / limit) - 1);
        used = used ? used + length + 1 : length % limit;
      }
    }
    return lines * size * 1.2 <= height;
  }
  let size = item.fontSize;
  while (size > 8 && !fits(size)) size -= 1;
  return Math.max(8, size);
}
