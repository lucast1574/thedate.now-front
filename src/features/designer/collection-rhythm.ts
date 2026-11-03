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
): FlyerCanvas {
  const original = invitationTemplates.find((item) => item.id === t.id);
  if (
    original &&
    (original.background !== t.background || original.accent !== t.accent)
  )
    return canvas;
  const family = templateArt(t) || "editorial";
  const reverse =
    family === "gala"
      ? ["Fecha y hora", "Lista de regalos"]
      : family === "fiesta"
        ? ["Fecha y hora", "Te esperamos"]
        : family === "editorial"
          ? ["Ubicación", "Guarda la fecha"]
          : family === "coastal"
            ? ["Fecha y hora", "Con todo nuestro cariño"]
            : ["Guarda la fecha", "Con todo nuestro cariño"];
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
