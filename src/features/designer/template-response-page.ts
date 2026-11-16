import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templatePage, templateText } from "./template-pages";
export function templateResponsePage(
  t: InvitationTemplate,
  i18n: Translator = spanishTranslator,
) {
  return templatePage(
    t,
    i18n("Confirmación de asistencia"),
    740,
    [
      templateText(
        t,
        "rsvp-title",
        i18n("¿Nos acompañas?"),
        110,
        150,
        58,
        undefined,
        i18n,
      ),
      templateText(
        t,
        "rsvp-note",
        i18n(
          "Responde en la encuesta de WhatsApp y completa los datos de tu asistencia.",
        ),
        330,
        180,
        30,
        undefined,
        i18n,
      ),
      templateText(
        t,
        "rsvp-action",
        i18n("Completar mi respuesta"),
        570,
        90,
        28,
        {
          binding: "rsvp_link",
        },
        i18n,
      ),
    ],
    i18n,
  );
}
