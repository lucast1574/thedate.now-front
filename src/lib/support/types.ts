import {
  type Translator,
  localized,
  spanishTranslator,
} from "@/lib/i18n/translator";
export const supportStates = localized(
  (i18n: Translator) =>
    [
      { id: "OPEN", label: i18n("Por atender") },
      { id: "IN_PROGRESS", label: i18n("En atención") },
      { id: "WAITING", label: i18n("En espera") },
      { id: "DONE", label: i18n("Resuelto") },
    ] as const,
);
export type SupportState = ReturnType<typeof supportStates>[number]["id"];
export type Ticket = {
  id: string;
  title: string;
  description: string;
  state: SupportState;
  version: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  history: { state: SupportState; note?: string; at: string }[];
  requester?: { name: string; email: string };
};
export type TicketPage = {
  items: Ticket[];
  total: number;
  page: number;
  pages: number;
};
export const ticketStateLabel = (
  state: string,
  i18n: Translator = spanishTranslator,
) => supportStates(i18n).find((item) => item.id === state)?.label ?? state;
export const ticketDate = (raw: string, locale: string = "es") =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(raw));
export type Screenshot = { name: string; data: string };
export function submissionFor(
  previous: { key: string; payload: string } | null,
  payload: string,
  newID: () => string,
) {
  return previous?.payload === payload ? previous : { key: newID(), payload };
}
