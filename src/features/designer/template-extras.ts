import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import type { Event, DesignEvent } from "@/lib/events/types";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templatePage, templateText } from "./template-pages";
import { mapCoordinates } from "@/lib/events/map-element";

export type TemplateSource = DesignEvent &
  Partial<
    Pick<
      Event,
      | "startAt"
      | "timeZone"
      | "location"
      | "mapUrl"
      | "virtualUrl"
      | "isVirtual"
      | "creation"
    >
  >;

export function templateExtraPages(
  template: InvitationTemplate,
  source?: TemplateSource,
  i18n: Translator = spanishTranslator,
) {
  const pages = [];
  const previous =
    source?.sections
      ?.flatMap((s) => s.canvas?.elements || [])
      .filter((e) => e.binding === "restrictions") || [];
  const restrictionText =
    source?.celebration?.restrictionText ?? source?.creation?.restrictionText;
  const restrictionIcon =
    source?.celebration?.restrictionIcon ?? source?.creation?.restrictionIcon;
  const rules = restrictionText?.trim()
    ? [
        {
          text: restrictionText,
          restrictionIcon,
        },
      ]
    : previous.length
      ? previous
      : [
          {
            text: i18n("Tus indicaciones aparecerán aquí"),
            restrictionIcon: undefined,
          },
        ];
  for (const [index, rule] of rules.entries()) {
    pages.push(
      templatePage(
        template,
        i18n("Para disfrutar juntos"),
        600,
        [
          templateText(
            template,
            "rules-title",
            i18n("Ten en cuenta"),
            70,
            100,
            44,
            undefined,
            i18n,
          ),
          templateText(
            template,
            `rules-${index}`,
            rule.text || "",
            220,
            290,
            28,
            {
              binding: "restrictions",
              eventBound: true,
              restrictionStyle: "icon-text",
              restrictionIcon: rule.restrictionIcon || "lucide:shield-alert",
            },
            i18n,
          ),
        ],
        i18n,
      ),
    );
  }
  for (const page of pages) page.when = "restrictions";
  if (source?.celebration?.giftsEnabled !== false) {
    pages.push(
      templatePage(
        template,
        i18n("Lista de regalos"),
        560,
        [
          templateText(
            template,
            "gifts-title",
            i18n("Un detalle con cariño"),
            80,
            100,
            44,
            undefined,
            i18n,
          ),
          templateText(
            template,
            "gifts-note",
            i18n(
              "Tu compañía es nuestro mejor regalo. Si quieres tener un detalle, aquí encontrarás algunas ideas.",
            ),
            220,
            130,
            28,
            undefined,
            i18n,
          ),
          templateText(
            template,
            "gifts-link",
            i18n("Ver lista de regalos"),
            410,
            80,
            30,
            {
              binding: "gift_link",
              link: "/regalos",
              actionHint: true,
              hintText: i18n("Ver regalos"),
            },
            i18n,
          ),
        ],
        i18n,
      ),
    );
    pages[pages.length - 1].when = "gifts";
  }
  if (!source?.isVirtual) {
    pages.push(
      templatePage(
        template,
        i18n("El lugar en el mapa"),
        680,
        [
          templateText(
            template,
            "map-title",
            i18n("Aquí nos encontramos"),
            50,
            100,
            42,
            undefined,
            i18n,
          ),
          templateText(
            template,
            "map",
            "",
            190,
            390,
            24,
            {
              binding: "map",
              eventBound: true,
              mapStyle: template.kind === "wedding" ? "warm" : "natural",
              mapRadius: 20,
              mapSoftness: 8,
              mapZoom: 14,
              actionHint: true,
              ...mapCoordinates(source?.mapUrl),
              link: source?.mapUrl || "",
            },
            i18n,
          ),
        ],
        i18n,
      ),
    );
  }
  return pages;
}
