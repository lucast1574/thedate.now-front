import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templatePage, templateText } from "./template-pages";
export function templateResponsePage(t: InvitationTemplate) {
  return templatePage(t, "Confirmación de asistencia", 740, [
    templateText(t, "rsvp-title", "¿Nos acompañas?", 110, 150, 58),
    templateText(
      t,
      "rsvp-note",
      "Responde en la encuesta de WhatsApp y completa los datos de tu asistencia.",
      330,
      180,
      30,
    ),
    templateText(t, "rsvp-action", "Completar mi respuesta", 570, 90, 28, {
      binding: "rsvp_link",
    }),
  ]);
}
