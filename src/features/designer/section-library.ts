import {
  type Translator,
  localized,
  spanishTranslator,
} from "@/lib/i18n/translator";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
import { invitationTemplates } from "@/lib/events/template-catalog";
import { invitationTheme } from "./invitation-theme";
import { templateSequence } from "./template-sequence";
import { templatePage, templateText } from "./template-pages";
import { element } from "./flyer/canvas-model";
export const sectionRecipes = localized(
  (i18n: Translator) =>
    [
      ["cover", i18n("Portada"), "layout"],
      ["story", i18n("Historia"), "heart"],
      ["schedule", i18n("Itinerario"), "clock"],
      ["map", i18n("Mapa"), "lucide:map-pinned"],
      ["gallery", i18n("Galería"), "image"],
      ["dress", i18n("Dress code"), "lucide:shirt"],
      ["rsvp", "RSVP", "mail"],
    ] as const,
);
function buildLibrarySection(
  draft: DesignEvent,
  recipe: string,
  i18n: Translator = spanishTranslator,
): DesignSection {
  const theme = invitationTheme(draft, i18n);
  const base =
    invitationTemplates(i18n).find((t) => t.id === draft.templateId) ||
    invitationTemplates(i18n).find(
      (t) => t.kind === draft.kind && t.mode === "flyer",
    )!;
  const template = { ...base, accent: theme.ink, background: theme.background };
  const pages = templateSequence(template, draft, i18n);
  const match =
    recipe === "cover"
      ? pages[0]
      : recipe === "story"
        ? pages[1]
        : recipe === "dress"
          ? pages.find((s) => s.heading === "Dress code")
          : undefined;
  if (match)
    return {
      ...match,
      canvas: {
        ...match.canvas!,
        elements: match.canvas!.elements.map((e) => ({
          ...e,
          font: theme.font,
        })),
      },
    };
  const text = (
    id: string,
    value: string,
    y: number,
    height = 100,
    size = 32,
  ) =>
    templateText(
      template,
      id,
      value,
      y,
      height,
      size,
      { font: theme.font },
      i18n,
    );
  if (recipe === "map")
    return templatePage(
      template,
      i18n("Mapa"),
      900,
      [
        text("map-title", i18n("Aquí nos encontramos"), 65, 130, 48),
        element(
          "text",
          {
            id: "map",
            binding: "map",
            eventBound: true,
            x: 60,
            y: 250,
            width: 600,
            height: 410,
            fontSize: 28,
            color: theme.ink,
            font: theme.font,
          },
          i18n,
        ),
        text("map-location", i18n("Cómo llegar"), 710, 120, 30),
      ],
      i18n,
    );
  if (recipe === "gallery")
    return templatePage(
      template,
      i18n("Galería"),
      960,
      [
        text("gallery-title", i18n("Momentos para recordar"), 65, 130, 48),
        ...[
          [60, 250, 600, 320],
          [60, 600, 285, 240],
          [375, 600, 285, 240],
        ].map(([x, y, width, height], n) =>
          element(
            "image",
            {
              id: `gallery-${n}`,
              photoKey: "template-photo",
              x,
              y,
              width,
              height,
            },
            i18n,
          ),
        ),
      ],
      i18n,
    );
  if (recipe === "rsvp")
    return templatePage(
      template,
      i18n("Confirmación de asistencia"),
      620,
      [
        text("rsvp-title", i18n("¿Nos acompañas?"), 110, 140, 54),
        text(
          "rsvp-note",
          i18n(
            "Responde en la encuesta de WhatsApp. Después podrás completar los datos de tu asistencia.",
          ),
          290,
          140,
          28,
        ),
        {
          ...text("rsvp-action", i18n("Completar mi respuesta"), 460, 80, 28),
          binding: "rsvp_link",
        },
      ],
      i18n,
    );
  return templatePage(
    template,
    i18n("Itinerario"),
    960,
    [
      text("schedule-title", i18n("Así será la celebración"), 65, 130, 48),
      ...[
        i18n("La bienvenida"),
        i18n("El gran momento"),
        i18n("Seguimos celebrando"),
      ].map((label, n) =>
        text(
          `moment-${n}`,
          i18n("Hora · {v0}\nAñade los detalles de este momento.", {
            v0: label,
          }),
          260 + n * 190,
          140,
          32,
        ),
      ),
    ],
    i18n,
  );
}

export function librarySection(
  draft: DesignEvent,
  recipe: string,
  i18n: Translator = spanishTranslator,
): DesignSection {
  const section = buildLibrarySection(draft, recipe, i18n),
    theme = invitationTheme(draft, i18n);
  return {
    ...section,
    canvas: section.canvas
      ? {
          ...section.canvas,
          font: theme.font,
          elements: section.canvas.elements.map((e) => ({
            ...e,
            font: theme.font,
          })),
        }
      : undefined,
  };
}
