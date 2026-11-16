import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { element } from "./flyer/canvas-model";
import { templatePage, templateText } from "./template-pages";
export function templateLayoutPages(
  template: InvitationTemplate,
  i18n: Translator = spanishTranslator,
) {
  const layout = template.layout || "";
  const pages = [];
  const photo = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation = 0,
  ) =>
    element(
      "image",
      {
        id,
        photoKey: "template-photo",
        x,
        y,
        width,
        height,
        rotation,
      },
      i18n,
    );
  const heading = (title: string) =>
    templateText(template, "album-title", title, 60, 110, 42, undefined, i18n);
  {
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
    pages.push(
      templatePage(
        template,
        i18n("Nuestros momentos"),
        900,
        [
          heading(
            template.kind === "wedding"
              ? i18n("Una historia en imágenes")
              : i18n("Recuerdos por crear"),
          ),
          ...photos,
          templateText(
            template,
            "photo-note",
            i18n("Cada imagen cuenta una parte de esta celebración."),
            790,
            70,
            24,
            undefined,
            i18n,
          ),
        ],
        i18n,
      ),
    );
  }
  {
    const labels =
      template.kind === "wedding"
        ? [i18n("El encuentro"), i18n("El brindis"), i18n("La celebración")]
        : [
            i18n("La bienvenida"),
            i18n("El gran momento"),
            i18n("Seguimos celebrando"),
          ];
    pages.push(
      templatePage(
        template,
        i18n("El programa"),
        860,
        [
          heading(i18n("Así será nuestro día")),
          ...labels.flatMap((label, index) => [
            templateText(
              template,
              `step-${index}`,
              `0${index + 1}`,
              240 + index * 170,
              80,
              38,
              { x: 60, width: 80 },
              i18n,
            ),
            templateText(
              template,
              `moment-${index}`,
              `${label}\nAñade aquí la hora y los detalles.`,
              230 + index * 170,
              120,
              30,
              { x: 180, width: 460, align: "left" },
              i18n,
            ),
          ]),
        ],
        i18n,
      ),
    );
  }
  return pages;
}
