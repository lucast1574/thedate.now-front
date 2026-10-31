import type { FlyerCanvas, FlyerElement } from "./flyer";
import { dressParts } from "./dress-code";
export function dressHeight(item: FlyerElement) {
  const parts = dressParts(item.dressStyle),
    size = item.fontSize;
  const columns = Math.max(1, Math.floor(item.width / (size * 5.2)));
  const lines = (value: string, factor: number) =>
    value
      .split("\n")
      .reduce(
        (count, line) =>
          count +
          Math.max(1, Math.ceil(line.length / (item.width / (size * factor)))),
        0,
      );
  const [title, ...note] = (item.text || "Dress code").split("\n");
  let em = 1.2;
  if (parts.includes("icon")) em += 3;
  if (parts.includes("image")) em += 6;
  if (parts.includes("text"))
    em +=
      lines(title, 0.7) * 1.5 +
      (note.join("").trim() ? lines(note.join("\n"), 0.48) * 1.2 + 0.6 : 0);
  if (item.dressExcludedColors?.length)
    em += 2.6 + Math.ceil(item.dressExcludedColors.length / columns) * 3.8;
  return Math.ceil(em * size);
}
export function fitDressCanvas(canvas: FlyerCanvas): FlyerCanvas {
  let next = canvas;
  for (const original of canvas.elements
    .filter((e) => e.binding === "dress_code")
    .sort((a, b) => a.y - b.y)) {
    const authored = next.elements.find((e) => e.id === original.id)!;
    let item = authored;
    const available = Math.max(item.height, 2000 - next.height + item.height);
    while (dressHeight(item) > available && item.fontSize > 8)
      item = { ...item, fontSize: item.fontSize - 1 };
    const height = Math.max(item.height, dressHeight(item)),
      grow = height - item.height;
    if (!grow && item === authored) continue;
    const bottom = item.y + item.height;
    next = {
      ...next,
      height: Math.max(next.height + grow, item.y + height + 60),
      elements: next.elements.map((e) =>
        e.id === item.id
          ? { ...item, height }
          : e.y >= bottom - 1
            ? { ...e, y: e.y + grow }
            : e,
      ),
    };
  }
  return next;
}
