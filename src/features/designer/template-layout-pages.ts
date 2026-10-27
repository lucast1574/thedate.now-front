import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { element } from "./flyer/canvas-model";
import { templatePage, templateText } from "./template-pages";
export function templateLayoutPages(template: InvitationTemplate) {
  const layout = template.layout || "";
  const photo = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation = 0,
  ) =>
    element("image", {
      id,
      photoKey: "template-photo",
      x,
      y,
      width,
      height,
      rotation,
    });
  const heading = (title: string) =>
    templateText(template, "album-title", title, 60, 110, 42);
  if (
    ["gallery", "polaroid", "mosaic", "landscape", "waves"].includes(layout)
  ) {
    const photos =
      layout === "gallery"
        ? [
            photo("album-main", 60, 230, 360, 500),
            photo("album-top", 450, 230, 210, 220),
            photo("album-bottom", 450, 490, 210, 240),
          ]
        : layout === "polaroid"
          ? [
              photo("memory-left", 70, 250, 270, 420, -3),
              photo("memory-right", 380, 290, 270, 420, 3),
            ]
          : layout === "mosaic"
            ? [
                photo("mosaic-a", 60, 240, 280, 280),
                photo("mosaic-b", 380, 240, 280, 280),
                photo("mosaic-c", 60, 560, 600, 180),
              ]
            : [
                photo("panorama-a", 60, 220, 600, 220),
                photo("panorama-b", 60, 490, 600, 220),
              ];
    return [
      templatePage(template, "Nuestros momentos", 900, [
        heading(
          template.kind === "wedding"
            ? "Una historia en imágenes"
            : "Recuerdos por crear",
        ),
        ...photos,
        templateText(
          template,
          "photo-note",
          "Cada imagen cuenta una parte de esta celebración.",
          790,
          70,
          24,
        ),
      ]),
    ];
  }
  if (["split", "cinematic", "grid"].includes(layout)) {
    const labels =
      template.kind === "wedding"
        ? ["El encuentro", "El brindis", "La celebración"]
        : ["La bienvenida", "El gran momento", "Seguimos celebrando"];
    return [
      templatePage(template, "El programa", 860, [
        heading("Así será nuestro día"),
        ...labels.flatMap((label, index) => [
          templateText(
            template,
            `step-${index}`,
            `0${index + 1}`,
            240 + index * 170,
            80,
            38,
            { x: 60, width: 80 },
          ),
          templateText(
            template,
            `moment-${index}`,
            `${label}\nAñade aquí la hora y los detalles.`,
            230 + index * 170,
            120,
            30,
            { x: 180, width: 460, align: "left" },
          ),
        ]),
      ]),
    ];
  }
  return [];
}
