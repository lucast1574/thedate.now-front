import type { Event } from "@/lib/events/types";
import ActionButton from "@/components/action-button";
export default function PendingPayment({
  event,
  busy,
  enabled,
  onCheckout,
}: {
  event: Event;
  busy: boolean;
  enabled: boolean;
  onCheckout: () => void;
}) {
  return (
    <section className="demo-continuity-note">
      <h2>Continúa con tu invitación</h2>
      <p>
        Tu diseño y tus datos están guardados. Completa el pago para activar tu
        evento y seguir en el editor.
      </p>
      <ActionButton
        className="office-button"
        disabled={busy || !enabled}
        onClick={onCheckout}
      >
        {enabled
          ? `Continuar al pago · USD ${event.kind === "wedding" ? "20" : "5"}`
          : "Pagos en preparación"}
      </ActionButton>
    </section>
  );
}
