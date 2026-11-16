import { useTranslator } from "@/lib/i18n/react";
import { type Translator, localized } from "@/lib/i18n/translator";
import DeliveryArtwork from "./delivery-artwork";
import DeliveryProgress from "./delivery-progress";
import Icon from "@/components/icon";
import { useInvitationDelivery } from "./use-invitation-delivery";

const phases = localized(
  (i18n: Translator) =>
    ({
      draft: [
        i18n("Todo listo para invitar"),
        i18n(
          "Al enviar, primero prepararemos la web. Nadie recibirá un mensaje hasta que su invitación esté lista.",
        ),
      ],
      preparing: [
        i18n("Estamos preparando tu invitación"),
        i18n(
          "Estamos publicando y comprobando tu web. Todavía no estamos enviando mensajes.",
        ),
      ],
      sending: [
        i18n("Estamos enviando las invitaciones"),
        i18n(
          "Cada persona recibe su enlace por WhatsApp, siguiendo el orden de tu lista y el aforo disponible.",
        ),
      ],
      waiting: [
        i18n("Tu lista sigue avanzando"),
        i18n(
          "Los siguientes invitados esperan su turno por límite de aforo. Cuando alguien decline o amplíes la capacidad del evento, se enviarán automáticamente.",
        ),
      ],
      complete: [
        i18n("Invitaciones enviadas"),
        i18n(
          "Puedes seguir las respuestas aquí. Los nuevos invitados se añaden al final y se enviarán automáticamente cuando haya cupo.",
        ),
      ],
      attention: [
        i18n("Envíos completados con observaciones"),
        i18n(
          "Tus invitaciones disponibles ya fueron enviadas por WhatsApp. Algunos números necesitan revisión o no pudieron entregarse.",
        ),
      ],
      error: [
        i18n("No pudimos preparar la invitación"),
        i18n(
          "Tu lista está guardada. Vuelve a intentar preparar la web para continuar con los envíos.",
        ),
      ],
    }) as const,
);
export default function InvitationDelivery({
  eventId,
  onUpdate,
  guestCount,
}: {
  eventId: string;
  onUpdate: () => Promise<void>;
  guestCount?: number;
}) {
  const i18n = useTranslator();

  const { delivery, busy, error, start } = useInvitationDelivery(
    eventId,
    onUpdate,
  );
  const phase =
    busy && (!delivery || delivery.phase === "draft")
      ? "preparing"
      : delivery?.phase || "draft";
  const total = guestCount ?? delivery?.total ?? 0;
  const [title, description] = phases(i18n)[phase];
  const working = busy || phase === "preparing" || phase === "sending";
  return (
    <section
      className="invitation-delivery"
      data-phase={phase}
      data-working={working}
      aria-labelledby="delivery-title"
      aria-busy={working}
    >
      <div className="delivery-intro">
        <div className="delivery-heading">
          <div>
            <p className="journey-eyebrow">
              {phase === "draft"
                ? i18n("EL SIGUIENTE PASO")
                : i18n("EL ENVÍO DE TU INVITACIÓN")}
            </p>
            <h2 id="delivery-title">{title}</h2>
            <p role="status" aria-live="polite">
              {description}
            </p>
          </div>
        </div>
        <DeliveryArtwork phase={phase} />
      </div>
      <DeliveryProgress delivery={delivery} phase={phase} />
      {(phase === "draft" ||
        phase === "error" ||
        (delivery?.failed ?? 0) + (delivery?.uncertain ?? 0) > 0) && (
        <button
          type="button"
          className="office-button"
          disabled={busy || !total}
          onClick={() =>
            void start((delivery?.failed ?? 0) + (delivery?.uncertain ?? 0) > 0)
          }
        >
          <Icon name="mail" />
          {busy
            ? i18n("Preparando…")
            : (delivery?.failed ?? 0) + (delivery?.uncertain ?? 0) > 0
              ? i18n("Reintentar envíos pendientes")
              : phase === "error"
                ? i18n("Volver a intentar")
                : i18n("Enviar invitaciones")}
        </button>
      )}
      {!total && (
        <p className="guest-hint">
          {i18n("Primero añade al menos un invitado a tu lista.")}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      <p className="delivery-reassurance">
        <Icon name="lock" />
        {i18n(
          "Puedes salir de esta pantalla: la preparación y los envíos continúan.",
        )}
      </p>
    </section>
  );
}
