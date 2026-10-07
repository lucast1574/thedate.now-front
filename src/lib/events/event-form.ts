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
