import type { Event, User } from "@/lib/events/types";
import { useState } from "react";
import { api } from "@/lib/api/client";
import ActionButton from "@/components/action-button";
export default function PendingPayment({
  event,
  user,
  busy,
  enabled,
  onCheckout,
}: {
  event: Event;
  user: User;
  busy: boolean;
  enabled: boolean;
  onCheckout: () => void;
}) {
  const professional =
    event.kind === "wedding"
      ? user.role === "planner"
      : user.role === "organizer";
  const price = event.kind === "wedding" ? 20 : 10;
  const [working, setWorking] = useState(false),
    [error, setError] = useState("");
  async function pay(mode: "balance" | "cancel_balance") {
    setWorking(true);
    setError("");
    try {
      const result = await api<{ url: string }>(
        `/api/backend/events/${event.id}/checkout`,
        "POST",
        { mode },
      );
      window.location.href = result.url;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setWorking(false);
    }
  }
  return (
    <section className="demo-continuity-note">
      <h2>Continúa con tu invitación</h2>
      <p>
        Tu diseño y tus datos están guardados. Completa el pago para activar tu
        evento y seguir en el editor.
      </p>
      <ActionButton
        className="office-button"
        disabled={busy || working || !enabled}
        onClick={onCheckout}
      >
        {enabled ? `Pagar el evento · USD ${price}` : "Pagos en preparación"}
      </ActionButton>
      {professional && event.ownerId === user.id && (
        <p>
          Recibes{" "}
          {event.kind === "wedding"
            ? "US$5 por esta boda"
            : "US$2 por este evento"}{" "}
          en tu saldo profesional después de 7 días del pago. Este beneficio es
          privado de tu cuenta.
        </p>
      )}
      <button
        className="office-button secondary"
        disabled={busy || working || !enabled}
        onClick={() => void pay("balance")}
      >
        Pagar el evento completo con mi saldo
      </button>
      {event.paymentStatus === "balance_pending" && (
        <button
          className="office-button secondary"
          disabled={busy || working}
          onClick={() => void pay("cancel_balance")}
        >
          Cancelar intento de saldo y elegir otro pago
        </button>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
