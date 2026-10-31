import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
export type Alignment =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "center-x"
  | "center-y"
  | "space-x"
  | "space-y";
export function selectionIds(canvas: FlyerCanvas, ids: string[]) {
  const groups = new Set(
    canvas.elements
      .filter((e) => ids.includes(e.id))
      .map((e) => e.groupId)
      .filter(Boolean),
  );
  return canvas.elements
    .filter((e) => ids.includes(e.id) || (!!e.groupId && groups.has(e.groupId)))
    .map((e) => e.id);
}
export function selectionBounds(items: FlyerElement[]) {
  const x = Math.min(...items.map((e) => e.x)),
    y = Math.min(...items.map((e) => e.y));
  return {
    x,
    y,
    width: Math.max(...items.map((e) => e.x + e.width)) - x,
    height: Math.max(...items.map((e) => e.y + e.height)) - y,
  };
}
export function moveSelection(
  canvas: FlyerCanvas,
  ids: string[],
  dx: number,
  dy: number,
) {
  const lockedGroups = new Set(
    canvas.elements.filter((e) => e.locked && e.groupId).map((e) => e.groupId),
  );
  const items = canvas.elements.filter(
    (e) =>
      ids.includes(e.id) &&
      !e.locked &&
      (!e.groupId || !lockedGroups.has(e.groupId)),
  );
  if (!items.length) return canvas;
  const box = selectionBounds(items);
  dx = Math.max(-box.x, Math.min(dx, canvas.width - box.x - box.width));
  dy = Math.max(-box.y, Math.min(dy, canvas.height - box.y - box.height));
  return {
    ...canvas,
    elements: canvas.elements.map((e) =>
      items.includes(e) ? { ...e, x: e.x + dx, y: e.y + dy } : e,
    ),
  };
}
export function alignSelection(
  canvas: FlyerCanvas,
  ids: string[],
  action: Alignment,
) {
  const lockedGroups = new Set(
    canvas.elements.filter((e) => e.locked && e.groupId).map((e) => e.groupId),
  );
  const items = canvas.elements.filter(
    (e) =>
      ids.includes(e.id) &&
      !e.locked &&
      (!e.groupId || !lockedGroups.has(e.groupId)),
  );
  const groups = new Map<string, FlyerElement[]>();
  items.forEach((e) => {
    const key = e.groupId || e.id;
    groups.set(key, [...(groups.get(key) || []), e]);
  });
  const units = [...groups].map(([id, elements]) => ({
    id,
    elements,
    ...selectionBounds(elements),
  }));
  if (!units.length || (action.startsWith("space") && units.length < 3))
    return canvas;
  const bounds = selectionBounds(items),
    box =
      units.length === 1
        ? { x: 0, y: 0, width: canvas.width, height: canvas.height }
        : bounds;
  const horizontal = action === "space-x",
    sorted = [...units].sort((a, b) => (horizontal ? a.x - b.x : a.y - b.y));
  const gap =
    ((horizontal ? box.width : box.height) -
      units.reduce((sum, e) => sum + (horizontal ? e.width : e.height), 0)) /
    Math.max(1, units.length - 1);
  const offsets = new Map<string, { x: number; y: number }>();
  let cursor = horizontal ? box.x : box.y;
  for (const unit of sorted) {
    const target =
      action === "left"
        ? { x: box.x, y: unit.y }
        : action === "right"
          ? { x: box.x + box.width - unit.width, y: unit.y }
          : action === "top"
            ? { x: unit.x, y: box.y }
            : action === "bottom"
              ? { x: unit.x, y: box.y + box.height - unit.height }
              : action === "center-x"
                ? { x: box.x + (box.width - unit.width) / 2, y: unit.y }
                : action === "center-y"
                  ? { x: unit.x, y: box.y + (box.height - unit.height) / 2 }
                  : horizontal
                    ? { x: cursor, y: unit.y }
                    : { x: unit.x, y: cursor };
    unit.elements.forEach((e) =>
      offsets.set(e.id, { x: target.x - unit.x, y: target.y - unit.y }),
    );
    cursor += (horizontal ? unit.width : unit.height) + gap;
  }
  return {
    ...canvas,
    elements: canvas.elements.map((e) => {
      const delta = offsets.get(e.id);
      return delta ? { ...e, x: e.x + delta.x, y: e.y + delta.y } : e;
    }),
  };
}
export function elementStyle(item: FlyerElement): Partial<FlyerElement> {
  return {
    color: item.color,
    font: item.font,
    fontSize: item.fontSize,
    bold: item.bold,
    align: item.align,
  };
}
