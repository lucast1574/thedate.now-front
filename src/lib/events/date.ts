export function formatEventDate(startAt: string, timeZone?: string) {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return "Próximamente";
  return new Intl.DateTimeFormat("es", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: timeZone || "America/Bogota",
  }).format(date);
}
