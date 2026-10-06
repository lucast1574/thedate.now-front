import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
export function element(
  type: FlyerElement["type"],
  patch: Partial<FlyerElement> = {},
): FlyerElement {
  return {
    id: crypto.randomUUID(),
    type,
    x: 80,
    y: 120,
    width: 560,
    height: 120,
    rotation: 0,
    color: "#463466",
    font: "serif",
    fontSize: 40,
    bold: false,
    align: "center",
    ...(type === "text"
      ? { text: "Tu texto aquí" }
      : type === "icon"
        ? { icon: "heart", width: 100, height: 100, fontSize: 72 }
        : { width: 300, height: 300 }),
    ...patch,
  };
}
export function blankCanvas(accent: string): FlyerCanvas {
  return {
    width: 720,
    height: 960,
    background: "#fff9ed",
    elements: [
      element("text", {
        text: "Una nueva sección",
        color: accent,
        y: 300,
        fontSize: 54,
      }),
    ],
  };
}
export function sectionCanvas(
  section: DesignSection,
  draft: DesignEvent,
): FlyerCanvas {
  if (section.canvas) return section.canvas;
  const elements = [
    element("text", {
      text: section.heading,
      y: 110,
      fontSize: 54,
      color: draft.accentColor,
    }),
    element("text", { text: section.body, y: 250, height: 250, fontSize: 28 }),
  ];
  if (section.guestText) elements.push({ ...section.guestText, y: 540 });
  if (section.icon && section.icon !== "none")
    elements.push(
      element("icon", {
        icon: section.icon,
        x: 310,
        y: 20,
        color: draft.accentColor,
      }),
    );
  if (section.photoKey)
    elements.push(
      element("image", {
        photoKey: section.photoKey,
        x: 110,
        y: 550,
        width: 500,
        height: 300,
      }),
    );
  return { width: 720, height: 960, background: "#fff9ed", elements };
}
export function flyerSections(draft: DesignEvent) {
  const sections = draft.sections?.length
    ? draft.sections
    : [
        {
          id: crypto.randomUUID(),
          icon: "heart",
          heading: draft.title,
          body: draft.description,
          photoKey: draft.photoKeys[0],
        },
      ];
  return sections.map((section) => ({
    ...section,
    canvas: sectionCanvas(section, draft),
  }));
}
export function moveElement(
  item: FlyerElement,
  dx: number,
  dy: number,
  canvas: FlyerCanvas,
) {
  return {
    ...item,
    x: clamp(item.x + dx, 0, canvas.width - item.width),
    y: clamp(item.y + dy, 0, canvas.height - item.height),
  };
}
export function resizeElement(
  item: FlyerElement,
  width: number,
  height: number,
  canvas: FlyerCanvas,
) {
  return {
    ...item,
    width: clamp(width, 16, canvas.width - item.x),
    height: clamp(height, 16, canvas.height - item.y),
  };
}
export function canvasFormat(
  canvas: FlyerCanvas,
  width: number,
  height: number,
): FlyerCanvas {
  return {
    ...canvas,
    width,
    height,
    elements: canvas.elements.map((item) => {
      const nextWidth = clamp((item.width * width) / canvas.width, 16, width);
      const nextHeight = clamp(
        (item.height * height) / canvas.height,
        16,
        height,
      );
      return {
        ...item,
        width: nextWidth,
        height: nextHeight,
        x: clamp((item.x * width) / canvas.width, 0, width - nextWidth),
        y: clamp((item.y * height) / canvas.height, 0, height - nextHeight),
      };
    }),
  };
}
