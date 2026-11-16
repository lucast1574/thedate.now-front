import { useTranslator } from "@/lib/i18n/react";
import CelebrationElements from "./celebration-elements";
import Icon from "@/components/icon";
import { guestNameElement } from "@/lib/events/guest-name";
import type { DesignEvent, Event } from "@/lib/events/types";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { element } from "./canvas-model";
import LinkedEventElements from "./linked-event-elements";
export default function CanvasEventTools({
  event,
  draft,
  canvas,
  disabled,
  onAdd,
}: {
  event: Event;
  draft: DesignEvent;
  canvas: FlyerCanvas;
  disabled: boolean;
  onAdd: (item: FlyerElement) => void;
}) {
  const i18n = useTranslator();

  return (
    <>
      <h3>{i18n("Elementos de tu invitación")}</h3>
      <LinkedEventElements
        event={event}
        draft={draft}
        disabled={disabled}
        onAdd={onAdd}
      />
      <div className="canvas-special-tools">
        <button
          disabled={disabled}
          onClick={() =>
            onAdd({
              ...guestNameElement(draft.accentColor, crypto.randomUUID()),
              font: event.kind === "general" ? "sans" : "serif",
              x: 60,
              y: 120,
              width: canvas.width - 120,
            })
          }
        >
          <Icon name="users" />
          <span>
            {i18n("Nombre del invitado")}{" "}
            <small>{i18n("Personalizado para cada persona")}</small>
          </span>
          <Icon name="plus" />
        </button>
        <button
          disabled={disabled}
          onClick={() =>
            onAdd(
              element(
                "text",
                {
                  font: event.kind === "general" ? "sans" : "serif",
                  binding: "location",
                  eventBound: true,
                  actionHint: true,
                  locationStyle: "address",
                  address: event.location || "",
                  link: event.mapUrl || "",
                  text: i18n("Cómo llegar"),
                  x: 60,
                  y: 120,
                  width: canvas.width - 120,
                  height: 120,
                  fontSize: 28,
                  color: draft.accentColor,
                },
                i18n,
              ),
            )
          }
        >
          <Icon name="external" />
          <span>
            {i18n("Ubicación")}
            <small>{i18n("Nombre y dirección del lugar")}</small>
          </span>
          <Icon name="plus" />
        </button>
        <button
          disabled={disabled}
          onClick={() =>
            onAdd(
              element(
                "text",
                {
                  binding: "event_date",
                  eventBound: true,
                  text: i18n("{{fecha_hora}}"),
                  color: draft.accentColor,
                  fontSize: 30,
                },
                i18n,
              ),
            )
          }
        >
          <Icon name="calendar" />
          <span>
            {i18n("Fecha y hora")}{" "}
            <small>
              {event.kind === "general"
                ? i18n("Cuándo nos vemos")
                : i18n("El día que van a recordar")}
            </small>
          </span>
          <Icon name="plus" />
        </button>
      </div>
      <CelebrationElements draft={draft} disabled={disabled} onAdd={onAdd} />
    </>
  );
}
