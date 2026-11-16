import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templatePage, templateText } from "./template-pages";
export function calendarTemplatePage(
  template: InvitationTemplate,
  i18n: Translator = spanishTranslator,
) {
  return templatePage(
    template,
    i18n("Guarda la fecha"),
    440,
    [
      templateText(
        template,
        "calendar-heading",
        i18n("Que no se te pase este día"),
        70,
        100,
        40,
        undefined,
        i18n,
      ),
      templateText(
        template,
        "calendar-link",
        i18n("Añadir al calendario"),
        240,
        100,
        30,
        { binding: "calendar_link", eventBound: true },
        i18n,
      ),
    ],
    i18n,
  );
}
