import type { DesignEvent, DesignSection } from "@/lib/events/types";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { defaultCelebration } from "@/lib/events/celebration";
import { formatEventDate } from "@/lib/events/date";
import { element } from "./flyer/canvas-model";
import { templateCanvas } from "./template-canvas";
import { templatePage, templateText, templateIcon } from "./template-pages";
import { templateLayoutPages } from "./template-layout-pages";
import {
  templateDress,
  templateExtraPages,
  templateOpening,
  type TemplateSource as Source,
} from "./template-extras";
export function templateSequence(
  template: InvitationTemplate,
  source?: Source,
): DesignSection[] {
  const wedding = template.kind === "wedding";
  const celebration = source?.celebration || defaultCelebration(wedding);
  const text = (
    id: string,
    value: string,
    y: number,
    height = 100,
    size = 36,
  ) => templateText(template, id, value, y, height, size);
  const page = (
    heading: string,
    height: number,
    elements: ReturnType<typeof element>[],
  ) => templatePage(template, heading, height, elements);
  const cover = page("Portada", 960, []);
  cover.canvas = templateCanvas(template, {
    title: source?.title,
    body: source?.description,
  });
  const sample = "template-photo";
  const photo = sample;
  const personal = templateText(
    template,
    "guest",
    "Hola, {{nombre_invitado}}",
    48,
    100,
    38,
    { binding: "guest_name" },
  );
  const pages = [
    cover,
    page(wedding ? "Nuestra historia" : "Nos reunimos", 960, [
      personal,
      text(
        "intro",
        wedding
          ? "El comienzo de una nueva aventura"
          : "Los mejores momentos se comparten",
        160,
        100,
        36,
      ),
      element("image", {
        id: "sample-photo",
        photoKey: photo,
        x: 70,
        y: 290,
        width: 580,
        height: 440,
      }),
      text(
        "story",
        wedding
          ? "Queremos que seas parte de un día que recordaremos siempre."
          : "Una ocasión para reunirnos, reír y crear nuevos recuerdos.",
        780,
        120,
        28,
      ),
    ]),
    page("Fecha y hora", 640, [
      templateIcon(template, "calendar", 60),
      text(
        "save-date",
        wedding ? "Reserva esta fecha" : "Apunta el día",
        210,
        100,
        52,
      ),
      templateText(
        template,
        "date",
        formatEventDate(source?.startAt || "", source?.timeZone),
        350,
        160,
        34,
        {
          binding: "event_date",
          eventBound: true,
        },
      ),
    ]),
    page("Ubicación", 720, [
      templateIcon(template, "lucide:map-pinned", 50),
      text(
        "place-title",
        wedding ? "Nuestra celebración" : "Nos vemos aquí",
        200,
        100,
        48,
      ),
      templateText(
        template,
        "location",
        source?.isVirtual ? "Entrar al evento" : "Cómo llegar",
        350,
        170,
        32,
        {
          binding: "location",
          eventBound: true,
          actionHint: true,
          locationStyle: "all",
          address: source?.isVirtual
            ? "Celebremos en línea"
            : source?.location || "Lugar de la celebración",
          link: source?.isVirtual
            ? source.virtualUrl || ""
            : source?.mapUrl || "",
        },
      ),
    ]),
    page("Dress code", 700, [
      text("dress-title", "Dress code", 80, 100, 46),
      templateDress(
        template,
        source,
        `${celebration.dressCode}\n${celebration.dressNote}`,
      ),
    ]),
  ];
  if (celebration.adultsOnly)
    pages.push(
      page("Solo adultos", 540, [
        templateIcon(template, "heart", 50),
        text("adults-title", "Una celebración entre adultos", 200, 100, 42),
        templateText(
          template,
          "notice",
          celebration.adultsMessage,
          340,
          140,
          28,
          { binding: "adults_notice" },
        ),
      ]),
    );
  pages.push(...templateExtraPages(template, source));
  pages.push(...templateLayoutPages(template));
  pages.push(
    page(wedding ? "Con todo nuestro cariño" : "Te esperamos", 560, [
      templateIcon(template, wedding ? "flower" : "sparkle", 70),
      text(
        "thanks",
        wedding
          ? "Nos encantará compartirlo contigo"
          : "La celebración empieza contigo",
        240,
        150,
        50,
      ),
      text("closing", "Gracias por ser parte de este momento.", 430, 80, 26),
    ]),
  );
  return pages;
}
export function applyCompleteTemplate(
  draft: Source,
  template: InvitationTemplate,
): DesignEvent {
  if (draft.kind !== template.kind || template.mode !== "flyer") return draft;
  return {
    ...draft,
    template: template.style,
    templateId: template.id,
    designMode: "flyer",
    accentColor: template.accent,
    backgroundImage: null,
    opening: draft.opening
      ? { ...draft.opening, backgroundImage: undefined }
      : templateOpening(template),
    celebration:
      draft.celebration || defaultCelebration(draft.kind === "wedding"),
    sections: templateSequence(template, draft),
  };
}
