import type { Kind } from "./types";
export const generalGuestCategories = [
  "Familia",
  "Amigos",
  "Compañeros de trabajo",
  "Compañeros de estudios",
  "Vecinos",
  "Equipo o club",
  "Invitados especiales",
  "Otros",
];
export const guestCategories = [
  "Familia del novio",
  "Familia de la novia",
  "Amigos del novio",
  "Amigos de la novia",
  "Amigos",
  "Compañeros de trabajo",
  "Compañeros de trabajo del novio",
  "Compañeros de trabajo de la novia",
  "Otros",
];
const key = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
export function guestCategoriesFor(kind: Kind) {
  return kind === "general" ? generalGuestCategories : guestCategories;
}
export function guestCategory(value: string, kind: Kind = "wedding") {
  if (!value.trim()) return "";
  const choices = guestCategoriesFor(kind);
  const category = choices.find((item) => key(item) === key(value));
  if (!category)
    throw new Error(
      `Elige ${kind === "general" ? "un grupo" : "una categoría"} de la plantilla: ${choices.join(", ")}.`,
    );
  return category;
}
