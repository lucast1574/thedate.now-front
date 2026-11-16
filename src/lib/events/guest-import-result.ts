import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
export type GuestImportResult = {
  added: number;
  updated?: number;
  skipped: number;
  duplicates?: number;
  review?: { phone: string; name: string; reason: string }[];
};
export function guestImportSummary(
  result: GuestImportResult,
  i18n: Translator = spanishTranslator,
) {
  const parts: string[] = [];
  const updated = result.updated || 0;
  const duplicates = result.duplicates || 0;
  const unchanged = Math.max(0, result.skipped - duplicates);
  if (result.added)
    parts.push(
      `${result.added} ${result.added === 1 ? i18n("nuevo invitado") : i18n("nuevos invitados")}`,
    );
  if (updated)
    parts.push(`${updated} ${updated === 1 ? "actualizado" : "actualizados"}`);
  if (unchanged) parts.push(`${unchanged} sin cambios`);
  if (duplicates)
    parts.push(
      `${duplicates} ${duplicates === 1 ? "fila repetida omitida" : "filas repetidas omitidas"}`,
    );
  return parts.join(" · ") || i18n("No había invitados nuevos ni cambios.");
}
