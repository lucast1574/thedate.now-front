import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { invitationTemplates } from "@/lib/events/template-catalog";
import type { FlyerCanvas } from "@/lib/events/flyer";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templateArt } from "./template-art-direction";
const dark: Record<string, string> = {
  botanical: "#283e35",
  romance: "#683c48",
  gala: "#172330",
  editorial: "#272623",
  fiesta: "#382656",
  coastal: "#234f59",
};
export function collectionRhythm(
  canvas: FlyerCanvas,
  t: InvitationTemplate,
  heading: string,
  i18n: Translator = spanishTranslator,
): FlyerCanvas {
  const original = invitationTemplates(i18n).find((item) => item.id === t.id);
  if (
    original &&
    (original.background !== t.background || original.accent !== t.accent)
  )
    return canvas;
  const family = templateArt(t) || "editorial";
  const reverse =
    family === "gala"
      ? [i18n("Fecha y hora"), i18n("Lista de regalos")]
      : family === "fiesta"
        ? [i18n("Fecha y hora"), i18n("Te esperamos")]
        : family === "editorial"
          ? [i18n("Ubicación"), i18n("Guarda la fecha")]
          : family === "coastal"
            ? [i18n("Fecha y hora"), i18n("Con todo nuestro cariño")]
            : [i18n("Guarda la fecha"), i18n("Con todo nuestro cariño")];
  const inverted = reverse.includes(heading);
  const titlePattern = /title|intro|thanks|save-date|heading/;
  const elements = canvas.elements.map((e) => {
    if (e.type !== "text")
      return { ...e, color: inverted ? "#f9f4ea" : e.color };
    const title = titlePattern.test(e.id) && !e.binding;
    return {
      ...e,
      color: inverted ? "#f9f4ea" : e.color,
      font: title
        ? family === "fiesta"
          ? ("sans" as const)
          : t.font
        : ("sans" as const),
      typeface:
        title && family === "gala"
          ? ("display" as const)
          : title && family === "fiesta"
            ? ("rounded" as const)
            : undefined,
      lineHeight: title ? 1.12 : 1.45,
      letterSpacing: title && family === "gala" ? 0.025 : 0,
    };
  });
  return {
    ...canvas,
    background: inverted ? dark[family] : canvas.background,
    elements,
  };
}
