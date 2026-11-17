import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import Listbox from "@/components/listbox";
import { useTranslator } from "@/lib/i18n/react";
import type { Event, Guest } from "@/lib/events/types";
import type { GuestPayment } from "@/lib/events/admission";
import { admissionMoney, admissionTotal } from "@/lib/events/admission";
import { fullName, partySeats } from "@/lib/events/attendees";
export default function PaymentGuests({
  event,
  guests,
  payments,
  loading,
  error,
  onSelect,
}: {
  event: Event;
  guests: Guest[];
  payments: GuestPayment[];
  loading: boolean;
  error: string;
  onSelect: (guest: Guest) => void;
}) {
  const i18n = useTranslator(),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const admission = event.admission;
  if (!admission?.enabled) return null;
  const format = (cents: number) =>
    admissionMoney(cents, admission.currency, i18n.locale);
  const visible = guests.filter((g) => {
    const paid = payments
      .filter((p) => p.guestId === g.id)
      .reduce((n, p) => n + p.amountCents, 0);
    const pending = admissionTotal(admission, partySeats(g)) > paid;
    return (
      `${fullName(g)} ${g.phone}`
        .toLocaleLowerCase(i18n.locale)
        .includes(query.trim().toLocaleLowerCase(i18n.locale)) &&
      (filter === "all" || (filter === "pending" ? pending : !pending))
    );
  });
  return (
    <div className="payment-guests">
      <div className="message-center-tools payment-list-tools">
        <label className="message-center-search">
          <Icon name="lucide:search" />
          <input
            aria-label={i18n("Buscar pagos por invitado")}
            placeholder={i18n("Buscar invitado o teléfono")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <Listbox
          aria-label={i18n("Estado de los pagos")}
          value={filter}
          onValueChange={setFilter}
        >
          <option value="all">{i18n("Todos los invitados")}</option>
          <option value="pending">{i18n("Con saldo pendiente")}</option>
          <option value="covered">{i18n("Pagos cubiertos")}</option>
        </Listbox>
      </div>
      {guests.length > 0 && !visible.length && (
        <p className="inbox-filter-empty">
          {i18n("No hay invitados con estos filtros.")}
        </p>
      )}

      {!guests.length && (
        <p>{i18n("Añade invitados para empezar a registrar sus pagos.")}</p>
      )}
      {visible.map((g) => {
        const registered = payments
            .filter((p) => p.guestId === g.id)
            .reduce((n, p) => n + p.amountCents, 0),
          expected = admissionTotal(admission, partySeats(g)),
          balance = expected - registered;
        return (
          <article key={g.id} className="payment-guest">
            <div>
              <h2>{fullName(g)}</h2>
              <p>
                {partySeats(g)}{" "}
                {partySeats(g) === 1 ? i18n("persona") : i18n("personas")} ·{" "}
                {i18n("Total")} {format(expected)}
              </p>
              <p>
                {i18n("Registrado")} {format(registered)} ·{" "}
                {balance < 0 ? i18n("Excedente") : i18n("Pendiente")}{" "}
                {format(Math.abs(balance))}
              </p>
              <small
                className={`payment-status ${balance <= 0 ? "is-covered" : "is-pending"}`}
              >
                {balance <= 0
                  ? i18n("Cubierto")
                  : registered
                    ? i18n("Abono parcial")
                    : i18n("Sin pagos registrados")}
              </small>
            </div>
            <div className="payment-guest-actions">
              <Link href={`/manager/${event.id}?tab=messages&guest=${g.id}`}>
                <Icon name="lucide:messages-square" />
                {i18n("Ver conversación")}
              </Link>
              <button
                type="button"
                className="office-button"
                disabled={loading || Boolean(error)}
                onClick={() => onSelect(g)}
              >
                {i18n("Registrar pago manual")}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
