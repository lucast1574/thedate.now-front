"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslator } from "@/lib/i18n/react";
import type { Event, Guest } from "@/lib/events/types";
import { fullName, partySeats } from "@/lib/events/attendees";
import { admissionMoney, admissionTotal } from "@/lib/events/admission";
import Alert from "@/components/alert";
import { useGuestPayments } from "./use-guest-payments";
import PaymentForm from "./payment-form";
export default function PaymentsWorkspace({
  event,
  guests,
}: {
  event: Event;
  guests: Guest[];
}) {
  const i18n = useTranslator(),
    ledger = useGuestPayments(event.id, Boolean(event.admission?.enabled));
  const [guest, setGuest] = useState<Guest | null>(null);
  const admission = event.admission;
  if (event.kind !== "general") return null;
  if (!admission?.enabled)
    return (
      <section className="payments-empty">
        <h2>{i18n("Este evento no tiene costo")}</h2>
        <p>
          {i18n(
            "Puedes configurar el aporte y la moneda en los datos del evento.",
          )}
        </p>
        <Link href={`/?event=${event.id}`}>{i18n("Editar evento")}</Link>
      </section>
    );
  const format = (cents: number) =>
    admissionMoney(cents, admission.currency, i18n.locale);
  const total = guests.reduce(
    (n, g) => n + admissionTotal(admission, partySeats(g)),
    0,
  );
  const paid = ledger.payments.reduce((n, p) => n + p.amountCents, 0);
  return (
    <section className="payments-workspace">
      <Alert>{ledger.error}</Alert>
      <dl className="payment-overview">
        <div>
          <dt>{i18n("Total esperado")}</dt>
          <dd>{format(total)}</dd>
        </div>
        <div>
          <dt>{i18n("Ingresos registrados")}</dt>
          <dd>{format(paid)}</dd>
        </div>
        <div>
          <dt>{paid > total ? i18n("Excedente") : i18n("Saldo pendiente")}</dt>
          <dd>{format(Math.abs(total - paid))}</dd>
        </div>
      </dl>
      <p>
        {i18n(
          "Las fotos llegan a Mensajes. Aquí solo aparecen los pagos que registraste después de verificar el ingreso.",
        )}
      </p>
      {guest ? (
        <PaymentForm
          key={guest.id}
          event={event}
          guest={guest}
          payments={ledger.payments}
          onSaved={ledger.refresh}
          onClose={() => setGuest(null)}
        />
      ) : (
        <div className="payment-guests">
          {!guests.length && (
            <p>{i18n("Añade invitados para empezar a registrar sus pagos.")}</p>
          )}
          {guests.map((g) => {
            const registered = ledger.payments
                .filter((p) => p.guestId === g.id)
                .reduce((n, p) => n + p.amountCents, 0),
              expected = admissionTotal(admission, partySeats(g)),
              balance = expected - registered;
            return (
              <article key={g.id} className="payment-guest">
                <div>
                  <h2>{fullName(g)}</h2>
                  <p>
                    {i18n("{v0} personas", { v0: String(partySeats(g)) })} ·{" "}
                    {i18n("Total")} {format(expected)}
                  </p>
                  <p>
                    {i18n("Registrado")} {format(registered)} ·{" "}
                    {balance < 0 ? i18n("Excedente") : i18n("Pendiente")}{" "}
                    {format(Math.abs(balance))}
                  </p>
                  <small>
                    {balance <= 0
                      ? i18n("Cubierto")
                      : registered
                        ? i18n("Abono parcial")
                        : i18n("Sin pagos registrados")}
                  </small>
                </div>
                <div className="payment-guest-actions">
                  <Link
                    href={`/manager/${event.id}?tab=messages&guest=${g.id}`}
                  >
                    {i18n("Ver conversación")}
                  </Link>
                  <button
                    type="button"
                    disabled={ledger.loading || Boolean(ledger.error)}
                    onClick={() => setGuest(g)}
                  >
                    {i18n("Registrar pago manual")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {ledger.loading && <p role="status">{i18n("Cargando pagos…")}</p>}
      {ledger.payments.length > 0 && (
        <section className="payment-history">
          <h2>{i18n("Movimientos registrados")}</h2>
          {[...ledger.payments]
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((payment) => (
              <article className="payment-guest" key={payment.id}>
                <div>
                  <strong>
                    {fullName(
                      guests.find((g) => g.id === payment.guestId) || {
                        name: i18n("Invitado"),
                      },
                    )}{" "}
                    · {format(payment.amountCents)}
                  </strong>
                  <p>
                    {payment.paidOn} ·{" "}
                    {payment.method === "cash"
                      ? i18n("Efectivo")
                      : payment.method === "wallet"
                        ? i18n("Billetera digital")
                        : i18n("Transferencia")}
                  </p>
                  {payment.reference && <p>{payment.reference}</p>}
                  <small>
                    {payment.messageId
                      ? i18n("Imagen de WhatsApp vinculada")
                      : i18n("Registro manual")}
                  </small>
                </div>
                <Link
                  href={`/manager/${event.id}?tab=messages&guest=${payment.guestId}`}
                >
                  {i18n("Ver conversación")}
                </Link>
              </article>
            ))}
        </section>
      )}
    </section>
  );
}
