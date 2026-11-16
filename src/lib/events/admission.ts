export type Admission = {
  enabled: boolean;
  currency: string;
  amountCents: number;
  basis: "person" | "group";
  instructions: string;
};
export type GuestPayment = {
  id: string;
  guestId: string;
  messageId?: string;
  amountCents: number;
  currency: string;
  paidOn: string;
  method: string;
  reference: string;
  recordedBy: string;
  createdAt: string;
};
export const admissionCurrencies = [
  ["PEN", "Soles"],
  ["USD", "Dólares"],
  ["MXN", "Pesos mexicanos"],
  ["COP", "Pesos colombianos"],
  ["EUR", "Euros"],
  ["CLP", "Pesos chilenos"],
  ["ARS", "Pesos argentinos"],
] as const;
export function admissionMoney(cents: number, currency: string, locale = "es") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
export function admissionTotal(admission: Admission, seats: number) {
  return (
    admission.amountCents *
    (admission.basis === "group" ? 1 : Math.max(1, seats))
  );
}
export function amountToCents(value: string) {
  if (!/^\d{1,9}(?:[.,]\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.replace(",", ".").split(".");
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(amount) && amount > 0 && amount <= 100000000
    ? amount
    : null;
}
