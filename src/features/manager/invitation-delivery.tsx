import Icon from "@/components/icon";
import { useInvitationDelivery } from "./use-invitation-delivery";

const phases = {
  draft: [
    "Todo listo para invitar",
    "Al enviar, primero prepararemos la web. Nadie recibirá un mensaje hasta que su invitación esté lista.",
  ],
  preparing: [
    "Estamos preparando tu invitación",
    "Estamos publicando y comprobando tu web. Todavía no estamos enviando mensajes.",
  ],
  sending: [
    "Estamos enviando las invitaciones",
    "Cada persona recibe su enlace por WhatsApp, siguiendo el orden de tu lista y el aforo disponible.",
  ],
  waiting: [
    "Tu lista sigue avanzando",
    "Los siguientes invitados esperan su turno. Cuando alguien diga que no o libere cupos, enviaremos la siguiente invitación que corresponda.",
  ],
  complete: [
    "Invitaciones enviadas",
    "Puedes seguir las respuestas aquí. Los nuevos invitados se añaden al final y se enviarán automáticamente cuando haya cupo.",
  ],
  attention: [
    "Algunos envíos necesitan revisión",
    "Los mensajes con resultado incierto no se repiten automáticamente para evitar que alguien reciba la invitación dos veces.",
  ],
  error: [
    "No pudimos preparar la invitación",
    "Tu lista está guardada. Vuelve a intentar preparar la web para continuar con los envíos.",
  ],
} as const;
export default function InvitationDelivery({
  eventId,
  onUpdate,
  guestCount,
}: {
  eventId: string;
  onUpdate: () => Promise<void>;
  guestCount?: number;
}) {
  const { delivery, busy, error, start } = useInvitationDelivery(
    eventId,
    onUpdate,
  );
  const phase = delivery?.phase || "draft";
  const total = guestCount ?? delivery?.total ?? 0;
  const [title, description] = phases[phase];
  const working = busy || phase === "preparing" || phase === "sending";
  return (
    <section
      className="invitation-delivery"
      aria-labelledby="delivery-title"
      aria-busy={working}
    >
      <div className="delivery-heading">
        <span className={`delivery-symbol ${working ? "is-working" : ""}`}>
          <Icon
            name={working ? "refresh" : phase === "complete" ? "check" : "mail"}
          />
        </span>
        <div>
          <p className="journey-eyebrow">EL SIGUIENTE PASO</p>
          <h2 id="delivery-title">{title}</h2>
          <p role="status" aria-live="polite">
            {description}
          </p>
        </div>
      </div>
      <ol className="delivery-steps" aria-label="Pasos del envío">
        <li data-complete={!["draft", "preparing", "error"].includes(phase)}>
          <span>1</span>Preparamos la web
        </li>
        <li data-complete={!["draft", "preparing", "error"].includes(phase)}>
          <span>2</span>Comprobamos el enlace
        </li>
        <li data-complete={phase === "complete"}>
          <span>3</span>Enviamos por WhatsApp
        </li>
      </ol>
      {delivery && phase !== "draft" && (
        <div className="delivery-counts" role="status">
          <strong>
            {delivery.sent} de {delivery.total} enviadas
          </strong>
          <span>
            {delivery.waiting} por enviar
            {delivery.failed + delivery.uncertain > 0
              ? ` · ${delivery.failed + delivery.uncertain} por revisar`
              : ""}
          </span>
        </div>
      )}
      {(phase === "draft" || phase === "error") && (
        <button
          type="button"
          className="office-button"
          disabled={busy || !total}
          onClick={() => void start()}
        >
          <Icon name="mail" />
          {busy
            ? "Preparando…"
            : phase === "error"
              ? "Volver a intentar"
              : "Enviar invitaciones"}
        </button>
      )}
      {!total && (
        <p className="guest-hint">
          Primero añade al menos un invitado a tu lista.
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      <p className="delivery-reassurance">
        <Icon name="lock" />
        Puedes salir de esta pantalla: la preparación y los envíos continúan.
      </p>
    </section>
  );
}
