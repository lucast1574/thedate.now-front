import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
export function formatEventDate(
  startAt: string,
  timeZone?: string,
  i18n: Translator = spanishTranslator,
) {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return i18n("Próximamente");
  return new Intl.DateTimeFormat(i18n.locale, {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: timeZone || "America/Bogota",
  }).format(date);
}
