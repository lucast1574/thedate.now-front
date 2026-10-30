import Icon from "@/components/icon";
import type { FlyerElement } from "@/lib/events/flyer";
import { element } from "./canvas-model";
export default function CalendarElement({
  disabled,
  color,
  onAdd,
}: {
  disabled: boolean;
  color: string;
  onAdd: (item: FlyerElement) => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={() =>
        onAdd(
          element("text", {
            binding: "calendar_link",
            eventBound: true,
            text: "Añadir al calendario",
            color,
            fontSize: 30,
            height: 100,
          }),
        )
      }
    >
      <Icon name="calendar" />
      <span>
        Añadir al calendario
        <small>Fecha del evento, texto y estilo editables</small>
      </span>
      <Icon name="plus" />
    </button>
  );
}
