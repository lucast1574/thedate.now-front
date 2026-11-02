import type { FlyerCanvas } from "@/lib/events/flyer";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { DesignSection } from "@/lib/events/types";
import { templateIdentity } from "./template-identity";
export function interiorLayout(
  canvas: FlyerCanvas,
  t: InvitationTemplate,
  heading: string,
): FlyerCanvas {
  const p = templateIdentity(t);
  if (
    [
      "Nuestra historia",
      "Nos reunimos",
      "Nuestros momentos",
      "El programa",
    ].includes(heading)
  )
    return canvas;
  const elements = canvas.elements.map((e) => {
    if (e.type === "image" || e.binding === "map") return e;
    if (e.type === "icon")
      return { ...e, x: p.align === "left" ? p.inset : e.x };
    return { ...e, x: p.inset, width: 720 - p.inset * 2, align: p.align };
  });
  if (heading === "Fecha y hora") {
    return {
      ...canvas,
      height: 720,
      elements: elements.map((e) => {
        if (e.type === "icon")
          return { ...e, x: 610, y: 80, width: 42, height: 42 };
        if (e.binding === "event_date")
          return {
            ...e,
            x: 64,
            y: 290,
            width: 592,
            height: 270,
            fontSize: 58,
            align: p.align,
          };
        return {
          ...e,
          x: 64,
          y: 140,
          width: 592,
          height: 110,
          fontSize: 42,
          align: p.align,
        };
      }),
    };
  }
  if (heading === "Ubicación") {
    return {
      ...canvas,
      height: 820,
      elements: elements.map((e) => {
        if (e.type === "icon")
          return { ...e, x: 64, y: 80, width: 48, height: 48 };
        if (e.binding === "location")
          return {
            ...e,
            x: 64,
            y: 345,
            width: 592,
            height: 325,
            fontSize: 36,
            align: "left" as const,
          };
        return {
          ...e,
          x: 64,
          y: 180,
          width: 592,
          height: 125,
          fontSize: 60,
          align: "left" as const,
        };
      }),
    };
  }
  return { ...canvas, elements };
}
export function orderTemplateSections(
  sections: DesignSection[],
  t: InvitationTemplate,
) {
  const flow = templateIdentity(t).flow,
    story = t.kind === "wedding" ? "Nuestra historia" : "Nos reunimos";
  const first =
    flow === "date"
      ? ["Portada", "Fecha y hora", story, "Ubicación"]
      : flow === "place"
        ? ["Portada", "Ubicación", story, "Fecha y hora"]
        : ["Portada", story, "Fecha y hora", "Ubicación"];
  return [
    ...first.map((h) => sections.find((s) => s.heading === h)!).filter(Boolean),
    ...sections.filter((s) => !first.includes(s.heading)),
  ];
}
