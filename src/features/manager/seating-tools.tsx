import Icon from "@/components/icon";
import type { SeatingTable } from "@/lib/events/seating";
type Props = {
  capacity: number;
  shape: SeatingTable["shape"];
  includePending: boolean;
  busy: boolean;
  full: boolean;
  onCapacity: (n: number) => void;
  onShape: (shape: SeatingTable["shape"]) => void;
  onPending: (value: boolean) => void;
  onAdd: () => void;
  onPropose: () => void;
};
export default function SeatingTools({
  capacity,
  shape,
  includePending,
  busy,
  full,
  onCapacity,
  onShape,
  onPending,
  onAdd,
  onPropose,
}: Props) {
  return (
    <div className="seating-tools">
      <label>
        Cupos por nueva mesa
        <input
          type="number"
          min={1}
          max={50}
          value={capacity}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (Number.isInteger(value) && value >= 1 && value <= 50)
              onCapacity(value);
          }}
        />
      </label>
      <label>
        Forma
        <select
          value={shape}
          onChange={(e) => onShape(e.target.value as SeatingTable["shape"])}
        >
          <option value="round">Circular</option>
          <option value="rectangle">Rectangular</option>
        </select>
      </label>
      <button disabled={busy || full} onClick={onAdd}>
        ＋ Añadir mesa
      </button>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={includePending}
          onChange={(e) => onPending(e.target.checked)}
        />
        Incluir respuestas pendientes en propuesta
      </label>
      <button disabled={busy} onClick={onPropose}>
        <Icon name="users" /> Agrupar familias y proponer mesas
      </button>
    </div>
  );
}
