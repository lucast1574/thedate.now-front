import Icon from "@/components/icon";
import { guestNameElement } from "@/lib/events/guest-name";
import type { DesignEvent, Event } from "@/lib/events/types";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { element } from "./canvas-model";
export default function CanvasEventTools({
  event,
  draft,
  canvas,
  disabled,
  onAdd,
  text,
}: {
  event: Event;
  draft: DesignEvent;
  canvas: FlyerCanvas;
  disabled: boolean;
  onAdd: (item: FlyerElement) => void;
  text: (value: string, size?: number) => void;
}) {
  return (
    <>
      <h3>Elementos de tu invitación</h3>
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
            Nombre del invitado
            <small>Personalizado para cada persona</small>
          </span>
          <Icon name="plus" />
        </button>
        <button
          disabled={disabled}
          onClick={() =>
            onAdd(
              element("text", {
                font: event.kind === "general" ? "sans" : "serif",
                binding: "location",
                locationStyle: "address",
                address: event.location || "",
                link: event.mapUrl || "",
                text: "Cómo llegar",
                x: 60,
                y: 120,
                width: canvas.width - 120,
                height: 120,
                fontSize: 28,
                color: draft.accentColor,
              }),
            )
          }
        >
          <Icon name="external" />
          <span>
            Ubicación<small>Dirección de tu evento</small>
          </span>
          <Icon name="plus" />
        </button>
        <button
          disabled={disabled}
          onClick={() =>
            text(
              event.startAt
                ? new Intl.DateTimeFormat("es", {
                    dateStyle: "long",
                    timeStyle: "short",
                    timeZone: event.timeZone || "America/Bogota",
                  }).format(new Date(event.startAt))
                : "Fecha y hora",
              30,
            )
          }
        >
          <Icon name="calendar" />
          <span>
            Fecha y hora
            <small>
              {event.kind === "general"
                ? "Cuándo nos vemos"
                : "El día que van a recordar"}
            </small>
          </span>
          <Icon name="plus" />
        </button>
      </div>
    </>
  );
}
