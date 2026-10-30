import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templatePage, templateText } from "./template-pages";
export function calendarTemplatePage(template: InvitationTemplate) {
  return templatePage(template, "Guarda la fecha", 440, [
    templateText(
      template,
      "calendar-heading",
      "Que no se te pase este día",
      70,
      100,
      40,
    ),
    templateText(
      template,
      "calendar-link",
      "Añadir al calendario",
      240,
      100,
      30,
      { binding: "calendar_link", eventBound: true },
    ),
  ]);
}
