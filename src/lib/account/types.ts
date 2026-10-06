import type { Event, User } from "@/lib/events/types";
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
  events: Event[];
  payouts: Payout[];
};
export type Affiliate = {
  code: string;
  enabled: boolean;
  availableCents: number;
  earnedCents: number;
  referrals: number;
  conversions: number;
  withdrawals: Withdrawal[];
};
export const money = (cents: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
export const statusLabel = {
  pending: "Pendiente",
  approved: "Aprobado",
  paid: "Pagado",
  rejected: "Rechazado",
};
export type Run = (
  action: () => Promise<unknown>,
  notice: string,
) => Promise<void>;
