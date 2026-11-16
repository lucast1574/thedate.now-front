import { useTranslator } from "@/lib/i18n/react";
import PreparationProgress from "./preparation-progress";
import Icon from "@/components/icon";
import type { Delivery } from "./use-invitation-delivery";

export default function DeliveryProgress({
  delivery,
  phase,
}: {
  delivery: Delivery | null;
  phase: Delivery["phase"];
}) {
  const i18n = useTranslator();

  const verified = delivery?.deploymentPhase === "ready";
  const verifying = delivery?.deploymentPhase === "verifying";
  const ready = verified || !["draft", "preparing", "error"].includes(phase);
  const sent = delivery?.sent ?? 0,
    total = delivery?.total ?? 0;
  const percentage =
    total > 0
      ? Math.min(100, Math.max(0, Math.round((sent / total) * 100)))
      : 0;
  const steps = [
    {
      title: i18n("Preparamos la web"),
      description:
        ready || verifying
          ? i18n("Tu invitación está publicada")
          : i18n("Le damos vida a tu diseño"),
      icon: "mail",
      done: ready || verifying,
      active: phase === "preparing" && !verifying && !ready,
    },
    {
      title: i18n("Comprobamos el enlace"),
      description: ready
        ? i18n("Lista para recibir visitas")
        : i18n("Antes de enviar el primer mensaje"),
      icon: "external",
      done: ready,
      active: phase === "preparing" && verifying,
    },
    {
      title: i18n("Enviamos por WhatsApp"),
      description:
        phase === "complete"
          ? i18n("Todos los mensajes enviados")
          : phase === "waiting" && sent > 0
            ? `${sent} de ${total} enviadas (esperando cupos)`
            : phase === "attention" && sent > 0
              ? `${sent} de ${total} invitaciones enviadas`
              : i18n("Un enlace personal para cada invitado"),
      icon: "users",
      done: phase === "complete" || (phase === "attention" && sent > 0),
      active: phase === "sending" || phase === "waiting",
    },
  ];
  return (
    <>
      <ol className="delivery-steps" aria-label={i18n("Pasos del envío")}>
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
            {index < 2 && (
              <PreparationProgress
                phase={ready ? "ready" : delivery?.deploymentPhase}
                segment={index}
                visible={phase !== "draft" && phase !== "error"}
              />
            )}
          </li>
        ))}
      </ol>
      {delivery && phase !== "draft" && (
        <div className="delivery-dispatch">
          <div className="delivery-counts" role="status">
            <strong>
              <b key={sent}>{sent}</b> {i18n("de")} {total} {i18n("enviadas")}
            </strong>
            <span>
              {delivery.waiting} {i18n("por enviar")}{" "}
              {delivery.failed + delivery.uncertain > 0
                ? i18n(" · {v0} por revisar", {
                    v0: delivery.failed + delivery.uncertain,
                  })
                : ""}
            </span>
          </div>
          <div
            className="delivery-progress-track"
            role="progressbar"
            aria-label={i18n("Invitaciones enviadas")}
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
