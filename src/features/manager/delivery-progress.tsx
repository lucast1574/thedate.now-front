import Icon from "@/components/icon";
import type { Delivery } from "./use-invitation-delivery";

export default function DeliveryProgress({
  delivery,
  phase,
}: {
  delivery: Delivery | null;
  phase: Delivery["phase"];
}) {
  const ready = !["draft", "preparing", "error"].includes(phase);
  const sent = delivery?.sent ?? 0,
    total = delivery?.total ?? 0;
  const percentage =
    total > 0
      ? Math.min(100, Math.max(0, Math.round((sent / total) * 100)))
      : 0;
  const steps = [
    {
      title: "Preparamos la web",
      description: ready
        ? "Tu invitación está publicada"
        : "Le damos vida a tu diseño",
      icon: "mail",
      done: ready,
      active: phase === "preparing",
    },
    {
      title: "Comprobamos el enlace",
      description: ready
        ? "Lista para recibir visitas"
        : "Antes de enviar el primer mensaje",
      icon: "external",
      done: ready,
      active: false,
    },
    {
      title: "Enviamos por WhatsApp",
      description:
        phase === "complete"
          ? "Todos los mensajes enviados"
          : "Un enlace personal para cada invitado",
      icon: "users",
      done: phase === "complete",
      active: phase === "sending",
    },
  ];
  return (
    <>
      <ol className="delivery-steps" aria-label="Pasos del envío">
        {steps.map((step, index) => (
          <li
            key={step.title}
            data-state={
              step.done ? "complete" : step.active ? "active" : "pending"
            }
            aria-current={step.active ? "step" : undefined}
          >
            <span className="delivery-step-icon">
              <Icon name={step.done ? "check" : step.icon} />
            </span>
            <div>
              <small>0{index + 1}</small>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      {delivery && phase !== "draft" && (
        <div className="delivery-dispatch">
          <div className="delivery-counts" role="status">
            <strong>
              <b key={sent}>{sent}</b> de {total} enviadas
            </strong>
            <span>
              {delivery.waiting} por enviar
              {delivery.failed + delivery.uncertain > 0
                ? ` · ${delivery.failed + delivery.uncertain} por revisar`
                : ""}
            </span>
          </div>
          <div
            className="delivery-progress-track"
            role="progressbar"
            aria-label="Invitaciones enviadas"
            aria-valuemin={0}
            aria-valuemax={total || 1}
            aria-valuenow={sent}
            aria-valuetext={`${sent} de ${total} invitaciones enviadas`}
          >
            <span style={{ width: `${percentage}%` }} />
          </div>
        </div>
      )}
    </>
  );
}
