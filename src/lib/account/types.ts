import { type Translator, localized } from "@/lib/i18n/translator";
import type { User } from "@/lib/events/types";
export type Revenue = {
  events: number;
  courtesies: number;
  grossCents: number;
  refundedCents: number;
  netCents: number;
  testCents: number;
};
export type Overview = {
  products: Record<"wedding" | "general", Revenue>;
  users: number;
  testMode: boolean;
};
export type Withdrawal = {
  id: string;
  amountCents: number;
  method: string;
  details: string;
  status: "pending" | "approved" | "paid" | "rejected";
  note: string;
  createdAt: string;
};
export type Payout = {
  userId: string;
  name: string;
  email: string;
  balanceCents: number;
  withdrawal: Withdrawal;
};
export type AdminData = {
  overview: Overview;
  users: User[];
  payouts: Payout[];
};
export type Affiliate = {
  pendingCents?: number;
  managedEvents?: number;
  partnerEvents?: {
    eventId: string;
    title: string;
    kind: string;
    amount: number;
    credited: number;
    availableAt: string;
  }[];
  code: string;
  enabled: boolean;
  availableCents: number;
  earnedCents: number;
  referrals: number;
  conversions: number;
  withdrawals: Withdrawal[];
};
export const money = (cents: number, locale: string = "es") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
export const statusLabel = localized((i18n: Translator) => ({
  pending: i18n("Pendiente"),
  approved: i18n("Aprobado"),
  paid: i18n("Pagado"),
  rejected: i18n("Rechazado"),
}));
export type Run = (
  action: () => Promise<unknown>,
  notice: string,
) => Promise<void>;
