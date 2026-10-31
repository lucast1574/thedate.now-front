import type { DesignSection } from "@/lib/events/types";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templateIdentity } from "./template-identity";
export function templatePhotoVariant(
  pages: DesignSection[],
  photos: boolean,
  ink = "#555555",
  template?: InvitationTemplate,
) {
  if (photos) return pages;
  const p = template ? templateIdentity(template) : undefined;
  return pages
    .filter(
      (s) => !s.heading.includes("momentos") && !s.heading.includes("imágenes"),
    )
    .map((section) => {
      const canvas = section.canvas;
      if (
        !canvas ||
        !canvas.elements.some(
          (e) => e.type === "image" && e.photoKey === "template-photo",
        )
      )
        return section;
      const cover = section.heading === "Portada",
        inset = p?.inset || 100,
        left = p?.align === "left",
        story = p?.story || "portrait";
      const title =
        story === "split" || story === "statement"
          ? [inset, 300, 720 - 2 * inset, 420]
          : story === "letter"
            ? [inset, 410, 720 - 2 * inset, 330]
            : story === "panorama"
              ? [inset, 290, 720 - 2 * inset, 360]
              : [inset, 330, 720 - 2 * inset, 360];
      const elements = canvas.elements
        .filter((e) => !(e.type === "image" && e.photoKey === "template-photo"))
        .map((e) => {
          const color = e.color.toLowerCase() === "#ffffff" ? ink : e.color;
          if (cover && e.id === "title")
            return {
              ...e,
              x: title[0],
              y: title[1],
              width: title[2],
              height: title[3],
              align: p?.align || e.align,
              color,
            };
          if (cover && e.id === "kicker")
            return {
              ...e,
              x: inset,
              y: story === "letter" ? 220 : 155,
              width: 720 - 2 * inset,
              height: 65,
              align: p?.align || e.align,
              color,
            };
          if (cover && e.id === "body")
            return {
              ...e,
              x: inset,
              y: story === "letter" ? 860 : 850,
              width: left ? 440 : 720 - 2 * inset,
              height: 180,
              align: p?.align || e.align,
              color,
            };
          if (!cover && e.id.endsWith("intro"))
            return {
              ...e,
              x: inset,
              y: 360,
              width: 720 - 2 * inset,
              height: 360,
              align: p?.align || e.align,
              color,
            };
          if (!cover && e.id.endsWith("story"))
            return {
              ...e,
              x: inset,
              y: 900,
              width: 720 - 2 * inset,
              height: 250,
              align: p?.align || e.align,
              color,
            };
          return { ...e, color };
        });
      return { ...section, canvas: { ...canvas, elements } };
    });
}
