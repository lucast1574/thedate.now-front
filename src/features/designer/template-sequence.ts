import type { DesignEvent, Event, DesignSection } from "@/lib/events/types";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { defaultCelebration, defaultOpening } from "@/lib/events/celebration";
import { formatEventDate } from "@/lib/events/date";
import { element } from "./flyer/canvas-model";
import { templateCanvas } from "./template-canvas";
import { templatePage, templateText, templateIcon } from "./template-pages";
type Source = DesignEvent &
  Partial<
    Pick<
      Event,
      | "startAt"
      | "timeZone"
      | "location"
      | "mapUrl"
      | "virtualUrl"
      | "isVirtual"
    >
  >;
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
  const photo = source?.photoKeys[0] || sample;
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
      text(
        "date",
        formatEventDate(source?.startAt || "", source?.timeZone),
        350,
        160,
        34,
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
      templateText(template, "location", "Cómo llegar", 350, 170, 32, {
        binding: "location",
        locationStyle: "all",
        address: source?.location || "Lugar de la celebración",
        link: source?.mapUrl || "",
      }),
      text(
        "place-note",
        "Pulsa la ubicación para ver cómo llegar.",
        560,
        90,
        24,
      ),
    ]),
    page("Dress code", 700, [
      templateIcon(template, "lucide:shirt", 50),
      text("dress-title", "Dress code", 210, 80, 46),
      templateText(
        template,
        "dress",
        `${celebration.dressCode}\n${celebration.dressNote}`,
        330,
        240,
        36,
        {
          binding: "dress_code",
        },
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
    opening:
      draft.opening ||
      defaultOpening(
        draft.kind === "wedding",
        template.background,
        template.accent,
      ),
    celebration:
      draft.celebration || defaultCelebration(draft.kind === "wedding"),
    sections: templateSequence(template, draft),
  };
}
