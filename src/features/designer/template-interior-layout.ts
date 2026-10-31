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
