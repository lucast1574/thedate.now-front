import Icon from "@/components/icon";
import type { DesignEvent, Event } from "@/lib/events/types";
import type { FlyerElement } from "@/lib/events/flyer";
import { element } from "./canvas-model";
import { mapCoordinates } from "@/lib/events/map-element";
export default function LinkedEventElements({
  event,
  draft,
  disabled,
  onAdd,
}: {
  event: Event;
  draft: DesignEvent;
  disabled: boolean;
  onAdd: (item: FlyerElement) => void;
}) {
  return (
    <div className="canvas-special-tools">
      <button
        disabled={disabled}
        onClick={() =>
          onAdd(
            element("text", {
              binding:
                event.kind === "wedding" ? "couple_names" : "event_title",
              eventBound: true,
              text: event.kind === "wedding" ? "{{novios}}" : "{{evento}}",
              color: draft.accentColor,
            }),
          )
        }
      >
        <Icon name="heart" />
        <span>
          {event.kind === "wedding"
            ? "Nombres de los novios"
            : "Nombre del evento"}
          <small>Conectado a los datos de la celebración</small>
        </span>
        <Icon name="plus" />
      </button>
      {!event.isVirtual && (
        <button
          disabled={disabled}
          onClick={() =>
            onAdd(
              element("text", {
                binding: "map",
                eventBound: true,
                text: "",
                height: 320,
                actionHint: true,
                mapStyle: "warm",
                mapRadius: 18,
                mapZoom: 14,
                ...mapCoordinates(event.mapUrl),
                link: event.mapUrl,
                color: draft.accentColor,
              }),
            )
          }
        >
          <Icon name="lucide:map" />
          <span>
            Mapa<small>Ubicación, marcador y estilo propio</small>
          </span>
          <Icon name="plus" />
        </button>
      )}
    </div>
  );
}
