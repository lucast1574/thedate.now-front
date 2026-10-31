import type { DesignEvent, DesignSection } from "@/lib/events/types";
import { invitationTemplates } from "@/lib/events/template-catalog";
import { invitationTheme } from "./invitation-theme";
import { templateSequence } from "./template-sequence";
import { templatePage, templateText } from "./template-pages";
import { element } from "./flyer/canvas-model";
export const sectionRecipes = [
  ["cover", "Portada", "layout"],
  ["story", "Historia", "heart"],
  ["schedule", "Itinerario", "clock"],
  ["map", "Mapa", "lucide:map-pinned"],
  ["gallery", "Galería", "image"],
  ["dress", "Dress code", "lucide:shirt"],
  ["rsvp", "RSVP", "mail"],
] as const;
function buildLibrarySection(
  draft: DesignEvent,
  recipe: string,
): DesignSection {
  const theme = invitationTheme(draft);
  const base =
    invitationTemplates.find((t) => t.id === draft.templateId) ||
    invitationTemplates.find(
      (t) => t.kind === draft.kind && t.mode === "flyer",
    )!;
  const template = { ...base, accent: theme.ink, background: theme.background };
  const pages = templateSequence(template, draft);
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
  ) => templateText(template, id, value, y, height, size, { font: theme.font });
  if (recipe === "map")
    return templatePage(template, "Mapa", 900, [
      text("map-title", "Aquí nos encontramos", 65, 130, 48),
      element("text", {
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
      }),
      text("map-location", "Cómo llegar", 710, 120, 30),
    ]);
  if (recipe === "gallery")
    return templatePage(template, "Galería", 960, [
      text("gallery-title", "Momentos para recordar", 65, 130, 48),
      ...[
        [60, 250, 600, 320],
        [60, 600, 285, 240],
        [375, 600, 285, 240],
      ].map(([x, y, width, height], n) =>
        element("image", {
          id: `gallery-${n}`,
          photoKey: "template-photo",
          x,
          y,
          width,
          height,
        }),
      ),
    ]);
  if (recipe === "rsvp")
    return templatePage(template, "Confirmación de asistencia", 620, [
      text("rsvp-title", "¿Nos acompañas?", 110, 140, 54),
      text(
        "rsvp-note",
        "Responde en la encuesta de WhatsApp. Después podrás completar los datos de tu asistencia.",
        290,
        140,
        28,
      ),
      {
        ...text("rsvp-action", "Completar mi respuesta", 460, 80, 28),
        binding: "rsvp_link",
      },
    ]);
  return templatePage(template, "Itinerario", 960, [
    text("schedule-title", "Así será la celebración", 65, 130, 48),
    ...["La bienvenida", "El gran momento", "Seguimos celebrando"].map(
      (label, n) =>
        text(
          `moment-${n}`,
          `Hora · ${label}\nAñade los detalles de este momento.`,
          260 + n * 190,
          140,
          32,
        ),
    ),
  ]);
}

export function librarySection(
  draft: DesignEvent,
  recipe: string,
): DesignSection {
  const section = buildLibrarySection(draft, recipe),
    theme = invitationTheme(draft);
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
