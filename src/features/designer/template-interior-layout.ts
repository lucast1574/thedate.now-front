import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { collectionInterior } from "./collection-interiors";
import type { FlyerCanvas } from "@/lib/events/flyer";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { DesignSection } from "@/lib/events/types";
import { templateIdentity } from "./template-identity";
export function interiorLayout(
  canvas: FlyerCanvas,
  t: InvitationTemplate,
  heading: string,
  i18n: Translator = spanishTranslator,
): FlyerCanvas {
  const p = templateIdentity(t, i18n);
  if (
    [
      i18n("Nuestra historia"),
      i18n("Nos reunimos"),
      i18n("Nuestros momentos"),
      i18n("El programa"),
    ].includes(heading)
  )
    return canvas;
  const elements = canvas.elements.map((e) => {
    if (e.type === "image" || e.binding === "map") return e;
    if (e.type === "icon")
      return { ...e, x: p.align === "left" ? p.inset : e.x };
    return { ...e, x: p.inset, width: 720 - p.inset * 2, align: p.align };
  });
  return collectionInterior({ ...canvas, elements }, t, heading, i18n);
}
export function orderTemplateSections(
  sections: DesignSection[],
  t: InvitationTemplate,
  i18n: Translator = spanishTranslator,
) {
  const flow = templateIdentity(t, i18n).flow,
    story =
      t.kind === "wedding" ? i18n("Nuestra historia") : i18n("Nos reunimos");
  const first =
    flow === "date"
      ? [i18n("Portada"), i18n("Fecha y hora"), story, i18n("Ubicación")]
      : flow === "place"
        ? [i18n("Portada"), i18n("Ubicación"), story, i18n("Fecha y hora")]
        : [i18n("Portada"), story, i18n("Fecha y hora"), i18n("Ubicación")];
  return [
    ...first.map((h) => sections.find((s) => s.heading === h)!).filter(Boolean),
    ...sections.filter((s) => !first.includes(s.heading)),
  ];
}
