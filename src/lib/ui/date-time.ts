export function dateKey(year: number, month: number, day: number) {
  return `${year.toString().padStart(4, "0")}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}
export function localDay(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}
export function calendarDays(year: number, month: number) {
  const first = new Date(year, month, 1, 12),
    offset = (first.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0, 12).getDate();
  return Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, i) =>
    i >= offset && i < offset + count
      ? dateKey(year, month, i - offset + 1)
      : null,
  );
}
export function moveDay(value: string, amount: number) {
  const date = localDay(value);
  if (!date) return value;
  date.setDate(date.getDate() + amount);
  return dateKey(date.getFullYear(), date.getMonth(), date.getDate());
}
export function moveMonth(value: string, amount: number) {
  const date = localDay(value);
  if (!date) return value;
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
  const day = Math.min(
    date.getDate(),
    new Date(target.getFullYear(), target.getMonth() + 1, 0, 12).getDate(),
  );
  return dateKey(target.getFullYear(), target.getMonth(), day);
}
export function timeParts(value: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  const hour = match ? Number(match[1]) : 18;
  return {
    hour: hour % 12 || 12,
    minute: match ? Number(match[2]) : 0,
    period: hour >= 12 ? "PM" : "AM",
  };
}
export function timeValue(hour: number, minute: number, period: string) {
  const hours = (hour % 12) + (period === "PM" ? 12 : 0);
  return `${hours.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}
export function timeLabel(value: string) {
  const { hour, minute, period } = timeParts(value);
  return `${hour}:${minute.toString().padStart(2, "0")} ${period === "PM" ? "p. m." : "a. m."}`;
}
export function halfHourTimes(period: string) {
  const start = period === "PM" ? 12 : 0;
  return Array.from(
    { length: 24 },
    (_, i) =>
      `${String(start + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
  );
}
export function pickerPosition(
  rect: { left: number; top: number; bottom: number },
  width: number,
  height: number,
  contentHeight = 400,
) {
  const compact = width <= 600 || height <= 600;
  const panelWidth = Math.min(compact ? 390 : 320, width - 24);
  const left = Math.max(12, Math.min(rect.left, width - panelWidth - 12));
  if (compact)
    return {
      left: (width - panelWidth) / 2,
      bottom: 12,
      width: panelWidth,
      maxHeight: Math.max(100, height - 24),
    };
  const below = Math.max(0, height - rect.bottom - 20);
  const above = Math.max(0, rect.top - 20);
  const useBelow =
    below >= contentHeight ||
    (above < contentHeight && (below >= 280 || below >= above));
  const maxHeight = Math.max(0, useBelow ? below : above);
  return {
    left,
    top: useBelow
      ? rect.bottom + 8
      : Math.max(12, rect.top - Math.min(contentHeight, maxHeight) - 8),
    width: panelWidth,
    maxHeight,
  };
}
