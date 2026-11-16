import { useRef, useState, type FormEvent } from "react";
import { useTranslator } from "@/lib/i18n/react";
import { api } from "@/lib/api/client";
import type { Event, Guest } from "@/lib/events/types";
import {
  admissionMoney,
  admissionTotal,
  amountToCents,
  type GuestPayment,
} from "@/lib/events/admission";
import { fullName, partySeats } from "@/lib/events/attendees";
import type { InboxMessage } from "@/features/messages/types";
import MessageMedia from "@/features/messages/message-media";
import Listbox from "@/components/listbox";
import Alert from "@/components/alert";
import ActionButton from "@/components/action-button";
import DatePicker from "@/components/date-picker";
export default function PaymentForm({
  event,
  guest,
  message,
  payments,
  onSaved,
  onClose,
}: {
  event: Event;
  guest: Guest;
  message?: InboxMessage;
  payments: GuestPayment[];
  onSaved: () => Promise<void>;
  onClose: () => void;
}) {
  const i18n = useTranslator(),
    requestId = useRef(crypto.randomUUID()),
    running = useRef(false);
  const [method, setMethod] = useState("transfer"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [paidOn, setPaidOn] = useState(() =>
    new Date().toLocaleDateString("en-CA"),
  );
  const admission = event.admission;
  if (!admission?.enabled) return null;
  const paid = payments
    .filter((p) => p.guestId === guest.id)
    .reduce((sum, p) => sum + p.amountCents, 0);
  const total = admissionTotal(admission, partySeats(guest));
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (running.current || !admission) return;
    const data = new FormData(e.currentTarget),
      amountCents = amountToCents(String(data.get("amount")));
    if (!amountCents) {
      setError(i18n("Introduce un importe válido, con hasta dos decimales."));
      return;
    }
    running.current = true;
    setBusy(true);
    setError("");
    let committed = false;
    try {
      await api(
        `/api/backend/events/${event.id}/guest-payments`,
        "POST",
        {
          id: requestId.current,
          guestId: guest.id,
          messageId: message?.id,
          amountCents,
          currency: admission.currency,
          paidOn: data.get("paidOn"),
          method,
          reference: data.get("reference"),
          verified: data.get("verified") === "on",
        },
        i18n,
      );
      committed = true;
      await onSaved();
      onClose();
    } catch (error) {
      setError(
        committed
          ? i18n(
              "El pago se guardó. Recarga los pagos para verlo; no vuelvas a registrarlo.",
            )
          : (error as Error).message,
      );
    } finally {
      running.current = false;
      setBusy(false);
    }
  }
  return (
    <section className="guest-payment-form">
      <header>
        <div>
          <h2>{i18n("Registrar pago")}</h2>
          <p>{fullName(guest)}</p>
        </div>
        <button type="button" disabled={busy} onClick={onClose}>
          {i18n("Cerrar registro")}
        </button>
      </header>
      <div className="guest-payment-grid">
        {message ? (
          <MessageMedia message={message} />
        ) : (
          <p className="payment-manual-note">
            {i18n(
              "Registro manual: efectivo o pago recibido directamente, sin imagen vinculada.",
            )}
          </p>
        )}
        <form onSubmit={save} className="payment-fields">
          <dl className="payment-balance">
            <div>
              <dt>{i18n("Total de la invitación")}</dt>
              <dd>{admissionMoney(total, admission!.currency, i18n.locale)}</dd>
            </div>
            <div>
              <dt>{i18n("Registrado")}</dt>
              <dd>{admissionMoney(paid, admission!.currency, i18n.locale)}</dd>
            </div>
            <div>
              <dt>{total < paid ? i18n("Excedente") : i18n("Pendiente")}</dt>
              <dd>
                {admissionMoney(
                  Math.abs(total - paid),
                  admission!.currency,
                  i18n.locale,
                )}
              </dd>
            </div>
          </dl>
          <label>
            {i18n("Importe recibido")} · {admission!.currency}
            <input
              name="amount"
              required
              inputMode="decimal"
              placeholder="0.00"
              maxLength={12}
              disabled={busy}
              autoComplete="off"
            />
          </label>
          <div>
            <DatePicker
              label={i18n("Fecha del pago")}
              value={paidOn}
              onChange={setPaidOn}
              required
            />
            <input type="hidden" name="paidOn" value={paidOn} />
          </div>
          <label>
            {i18n("Medio de pago")}
            <Listbox value={method} onValueChange={setMethod} disabled={busy}>
              <option value="transfer">{i18n("Transferencia")}</option>
              <option value="wallet">
                {i18n("Yape, Plin u otra billetera")}
              </option>
              <option value="cash">{i18n("Efectivo")}</option>
            </Listbox>
          </label>
          <label>
            {i18n("Referencia o nota · opcional")}
            <input name="reference" maxLength={500} disabled={busy} />
          </label>
          <label className="payment-verification">
            <input name="verified" type="checkbox" required disabled={busy} />
            <span>{i18n("Verifiqué que recibí este importe.")}</span>
          </label>
          <Alert>{error}</Alert>
          <ActionButton disabled={busy} className="office-button">
            {busy ? i18n("Guardando…") : i18n("Guardar pago")}
          </ActionButton>
          <small>
            {i18n(
              "La asistencia no cambia. La imagen, si la hay, queda vinculada al pago.",
            )}
          </small>
        </form>
      </div>
    </section>
  );
}
