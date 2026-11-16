import { templateDress } from "./template-dress";
import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { templateResponsePage } from "./template-response-page";
import { templateStoryPage } from "./template-story-page";
import { orderTemplateSections } from "./template-interior-layout";
import { coupleNames } from "@/lib/events/element-values";
import { calendarTemplatePage } from "./calendar-template-page";
import type { DesignSection } from "@/lib/events/types";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { defaultCelebration } from "@/lib/events/celebration";
import { formatEventDate } from "@/lib/events/date";
import { element } from "./flyer/canvas-model";
import { templateCanvas } from "./template-canvas";
import { templatePage, templateText, templateIcon } from "./template-pages";
import { templateLayoutPages } from "./template-layout-pages";
import {
  templateExtraPages,
  type TemplateSource as Source,
} from "./template-extras";
export function templateSequence(
  template: InvitationTemplate,
  source?: Source,
  i18n: Translator = spanishTranslator,
): DesignSection[] {
  const wedding = template.kind === "wedding";
  const celebration = source?.celebration || defaultCelebration(wedding, i18n);
  const text = (
    id: string,
    value: string,
    y: number,
    height = 100,
    size = 36,
  ) => templateText(template, id, value, y, height, size, undefined, i18n);
  const page = (
    heading: string,
    height: number,
    elements: ReturnType<typeof element>[],
  ) => templatePage(template, heading, height, elements, i18n);
  const cover = page(i18n("Portada"), 960, []);
  cover.canvas = templateCanvas(
    template,
    {
      title: source && wedding ? coupleNames(source, i18n) : source?.title,
      body: source?.description,
    },
    i18n,
  );
  const pages = [
    cover,
    templateStoryPage(template, i18n),
    page(i18n("Fecha y hora"), 640, [
      templateIcon(template, "calendar", 60, i18n),
      text(
        "save-date",
        wedding ? i18n("Reserva esta fecha") : i18n("Apunta el día"),
        210,
        100,
        52,
      ),
      templateText(
        template,
        "date",
        formatEventDate(source?.startAt || "", source?.timeZone, i18n),
        350,
        160,
        34,
        {
          binding: "event_date",
          eventBound: true,
        },
        i18n,
      ),
    ]),
    page(i18n("Ubicación"), 720, [
      templateIcon(template, "lucide:map-pinned", 50, i18n),
      text(
        "place-title",
        wedding ? i18n("Nuestra celebración") : i18n("Nos vemos aquí"),
        200,
        100,
        48,
      ),
      templateText(
        template,
        "location",
        source?.isVirtual ? i18n("Entrar al evento") : i18n("Cómo llegar"),
        350,
        170,
        32,
        {
          binding: "location",
          eventBound: true,
          actionHint: true,
          locationStyle: "all",
          address: source?.isVirtual
            ? i18n("Celebremos en línea")
            : source?.location || i18n("Lugar de la celebración"),
          link: source?.isVirtual
            ? source.virtualUrl || ""
            : source?.mapUrl || "",
        },
        i18n,
      ),
    ]),
    page(i18n("Dress code"), 1040, [
      text("dress-title", i18n("Dress code"), 80, 100, 46),
      templateDress(
        template,
        source,
        `${celebration.dressCode}\n${celebration.dressNote}`,
        i18n,
      ),
    ]),
  ];
  if (celebration.adultsOnly)
    pages.push(
      page(i18n("Solo adultos"), 540, [
        templateIcon(template, "heart", 50, i18n),
        text(
          "adults-title",
          i18n("Una celebración entre adultos"),
          200,
          100,
          42,
        ),
        templateText(
          template,
          "notice",
          celebration.adultsMessage,
          340,
          140,
          28,
          { binding: "adults_notice" },
          i18n,
        ),
      ]),
    );
  pages.push(...templateExtraPages(template, source, i18n));
  pages.push(...templateLayoutPages(template, i18n));
  pages.push(calendarTemplatePage(template, i18n));
  pages.push(templateResponsePage(template, i18n));
  pages.push(
    page(
      wedding ? i18n("Con todo nuestro cariño") : i18n("Te esperamos"),
      560,
      [
        templateIcon(template, wedding ? "flower" : "sparkle", 70, i18n),
        text(
          "thanks",
          wedding
            ? i18n("Nos encantará compartirlo contigo")
            : i18n("La celebración empieza contigo"),
          240,
          150,
          50,
        ),
        text(
          "closing",
          i18n("Gracias por ser parte de este momento."),
          430,
          80,
          26,
        ),
      ],
    ),
  );
  return orderTemplateSections(pages, template, i18n);
}
