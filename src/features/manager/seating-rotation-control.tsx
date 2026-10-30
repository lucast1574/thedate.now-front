import Icon from "@/components/icon";
import { turnSeatingItem } from "@/lib/events/rotation";
export default function SeatingRotationControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (angle: number) => void;
}) {
  return (
    <div
      className="seating-rotation-control"
      role="group"
      aria-label="Girar elemento"
    >
      <span>Girar</span>
      <button
        type="button"
        aria-label="Girar 15 grados a la izquierda"
        onClick={() => onChange(turnSeatingItem(value, -15))}
      >
        <Icon name="lucide:rotate-ccw" />
      </button>
      <output aria-live="polite">{value}°</output>
      <button
        type="button"
        aria-label="Girar 15 grados a la derecha"
        onClick={() => onChange(turnSeatingItem(value, 15))}
      >
        <Icon name="lucide:rotate-cw" />
      </button>
    </div>
  );
}
