import { stageTemplate } from "./template-stage";
import { adaptTemplateCanvas } from "./adapt-template-content";
import { templateArt } from "./template-art-direction";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { element } from "./flyer/canvas-model";
import { templateLayouts, type Box } from "./template-layouts";
function tint(accent: string, background: string) {
  return (
    "#" +
    [1, 3, 5]
      .map((start) =>
        Math.round(
          parseInt(accent.slice(start, start + 2), 16) * 0.22 +
            parseInt(background.slice(start, start + 2), 16) * 0.78,
        )
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
export function templateCanvas(
  template: InvitationTemplate,
  content: { title?: string; body?: string; photoKey?: string } = {},
): FlyerCanvas {
  const layout =
    templateLayouts[
      template.layout || (template.kind === "wedding" ? "floral" : "poster")
    ];
  const elements: FlyerElement[] = [];
  const title =
    content.title ||
    (template.kind === "wedding" ? "Ana & Luis" : "Celebremos juntos");
  const body =
    content.body ||
    (template.kind === "wedding"
      ? "Un día para celebrar nuestra historia contigo."
      : "Una fecha para encontrarnos y celebrar lo que nos une.");
  function text(
    id: string,
    value: string,
    box: Box,
    patch: Partial<FlyerElement> = {},
  ) {
    const [x, y, width, height, size, align = "center"] = box;
    const fontSize = size;
    elements.push(
      element("text", {
        id,
        x,
        y,
        width,
        height,
        text: value.slice(0, 2000),
        font: template.font,
        color: template.layout === "cinematic" ? "#ffffff" : template.accent,
        fontSize,
        align,
        ...patch,
      }),
    );
  }
  if (layout.monogram) {
    const initials = title
      .split(/\s*[&+]\s*|\s+y\s+/i)
      .map((part) => part.trim()[0])
      .filter(Boolean)
      .slice(0, 2)
      .join(" & ");
    text("initials", initials || title[0], [80, 160, 560, 290, 150], {
      ...(template.kind === "wedding"
        ? {
            binding: "couple_names" as const,
            eventBound: true,
            nameFormat: "initials" as const,
          }
        : {}),
      color: tint(template.accent, template.background),
    });
  }
  text(
    "kicker",
    template.kind === "wedding" ? "NOS CASAMOS" : "ESTÁS INVITADO",
    layout.kicker,
    { font: "sans" },
  );
  const heading = layout.stacked
    ? title.replace(/\s*&\s*/, "\n&\n")
    : layout.uppercase
      ? title.toLocaleUpperCase("es")
      : title;
  text("title", heading, layout.title, {
    binding: template.kind === "wedding" ? "couple_names" : "event_title",
    nameFormat:
      template.kind === "wedding"
        ? layout.stacked
          ? "stacked"
          : layout.uppercase
            ? "uppercase"
            : "names"
        : undefined,
    eventBound: true,
    bold: template.layout === "poster" || template.layout === "celebration",
  });
  const photo =
    layout.photo ||
    (content.photoKey && template.layout === "editorial"
      ? [65, 490, 590, 300]
      : null);
  if (photo)
    elements.unshift(
      element("image", {
        id: "photo",
        photoKey: content.photoKey || "template-photo",
        photoFit: "cover",
        photoTreatment:
          template.layout === "cinematic"
            ? "cinema"
            : templateArt(template) === "botanical"
              ? "soft"
              : "fade",
        x: photo[0],
        y: photo[1],
        width: photo[2],
        height: photo[3],
      }),
    );
  text(
    "body",
    body,
    photo && !layout.photo ? [65, 815, 590, 120, 22, "left"] : layout.body,
  );
  return adaptTemplateCanvas(
    stageTemplate(
      {
        art: templateArt(template),
        font: template.font,
        width: 720,
        height: 960,
        background: template.background,
        elements,
      },
      template,
      true,
    ),
  );
}
