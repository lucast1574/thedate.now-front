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
  const price =
    event.kind === "wedding" ? (professional ? 15 : 20) : professional ? 8 : 10;
  const [working, setWorking] = useState(false),
    [link, setLink] = useState(""),
    [error, setError] = useState("");
  async function pay(mode: "client" | "balance" | "cancel_balance") {
    setWorking(true);
    setError("");
    try {
      const result = await api<{ url: string }>(
        `/api/backend/events/${event.id}/checkout`,
        "POST",
        { mode },
      );
      if (mode === "client") setLink(result.url);
      else window.location.href = result.url;
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
        {enabled
          ? `Pagar ${professional ? "con precio profesional" : "el evento"} · USD ${price}`
          : "Pagos en preparación"}
      </ActionButton>
      {professional && (
        <>
          <p>
            Tu descuento ya está incluido. Si paga tu cliente el precio público,
            recibes {event.kind === "wedding" ? "US$5" : "US$2"} de comisión
            después de 7 días. No se acumula con el descuento.
          </p>
          <button
            className="office-button secondary"
            disabled={busy || working || !enabled}
            onClick={() => void pay("client")}
          >
            Crear enlace de pago para mi cliente · US$
            {event.kind === "wedding" ? "20" : "10"}
          </button>
        </>
      )}
      {link && (
        <label>
          Enlace de pago de Stripe
          <input readOnly value={link} />
          <button
            className="office-button secondary"
            onClick={() =>
              void navigator.clipboard
                .writeText(link)
                .catch(() => setError("Selecciona y copia el enlace."))
            }
          >
            Copiar enlace para el cliente
          </button>
        </label>
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
