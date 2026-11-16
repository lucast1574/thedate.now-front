import { type Translator, localized } from "@/lib/i18n/translator";
export function suggestedAddress(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "y")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 63)
    .replace(/^-+|-+$/g, "");
}

export const defaultInvitationMessage = localized((i18n: Translator) =>
  i18n(
    "¡Queremos celebrar este momento contigo!\nConoce todos los detalles y confirma tu asistencia.\n\n👇 Por favor, responde en la encuesta de aquí abajo para confirmar tu asistencia.",
  ),
);
