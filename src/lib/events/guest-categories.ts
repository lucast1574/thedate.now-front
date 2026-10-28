export const guestCategories = [
  "Familia del novio",
  "Familia de la novia",
  "Amigos del novio",
  "Amigos de la novia",
  "Amigos",
  "Compañeros de trabajo",
  "Otros",
];
const key = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
export function guestCategory(value: string) {
  if (!value.trim()) return "";
  const category = guestCategories.find((item) => key(item) === key(value));
  if (!category)
    throw new Error(
      `Elige una categoría de la plantilla: ${guestCategories.join(", ")}.`,
    );
  return category;
}
