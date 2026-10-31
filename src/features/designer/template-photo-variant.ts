import type { DesignSection } from "@/lib/events/types";
export function templatePhotoVariant(
  pages: DesignSection[],
  photos: boolean,
  ink = "#555555",
) {
  if (photos) return pages;
  return pages
    .filter(
      (s) => !s.heading.includes("momentos") && !s.heading.includes("imágenes"),
    )
    .map((section, index) => {
      const canvas = section.canvas;
      if (!canvas) return section;
      const placeholders = canvas.elements.some(
        (e) => e.type === "image" && e.photoKey === "template-photo",
      );
      if (!placeholders) return section;
      const elements = canvas.elements
        .filter((e) => !(e.type === "image" && e.photoKey === "template-photo"))
        .map((e) => {
          if (index === 0 && e.id === "title")
            return {
              ...e,
              x: 110,
              y: 260,
              width: 500,
              height: 330,
              align: "center" as const,
              color: e.color.toLowerCase() === "#ffffff" ? ink : e.color,
            };
          if (index === 0 && e.id === "body")
            return {
              ...e,
              x: 130,
              y: 670,
              width: 460,
              height: 160,
              align: "center" as const,
              color: e.color.toLowerCase() === "#ffffff" ? ink : e.color,
            };
          if (index === 1 && e.id.endsWith("story"))
            return {
              ...e,
              x: 110,
              y: 370,
              width: 500,
              height: 220,
              fontSize: 34,
            };
          return {
            ...e,
            color: e.color.toLowerCase() === "#ffffff" ? ink : e.color,
          };
        });
      return {
        ...section,
        canvas: {
          ...canvas,
          height: index === 1 ? 720 : canvas.height,
          elements,
        },
      };
    });
}
