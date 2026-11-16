import {
  type Translator,
  localized,
  spanishTranslator,
} from "@/lib/i18n/translator";
import type { Kind } from "./types";
export const generalGuestCategories = localized((_i18n: Translator) => [
  "Familia",
  "Amigos",
  "Compañeros de trabajo",
  "Compañeros de estudios",
  "Vecinos",
  "Equipo o club",
  "Invitados especiales",
  "Otros",
]);
export const guestCategories = localized((_i18n: Translator) => [
  "Familia del novio",
  "Familia de la novia",
  "Amigos del novio",
  "Amigos de la novia",
  "Amigos",
  "Compañeros de trabajo",
  "Compañeros de trabajo del novio",
  "Compañeros de trabajo de la novia",
  "Otros",
]);
const key = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
export function guestCategoriesFor(
  kind: Kind,
  i18n: Translator = spanishTranslator,
) {
  return kind === "general"
    ? generalGuestCategories(i18n)
    : guestCategories(i18n);
}
export function guestCategory(
  value: string,
  kind: Kind = "wedding",
  i18n: Translator = spanishTranslator,
) {
  if (!value.trim()) return "";
  const choices = guestCategoriesFor(kind, i18n);
  const category = choices.find((item) => key(item) === key(value));
  if (!category)
    throw new Error(
      i18n("Elige {v0} de la plantilla: {v1}.", {
        v0: kind === "general" ? i18n("un grupo") : i18n("una categoría"),
        v1: choices.join(", "),
      }),
    );
  return category;
}
