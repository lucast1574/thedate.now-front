import Listbox from "@/components/listbox";
import Icon from "@/components/icon";
import type { SeatingTable } from "@/lib/events/seating";
type Props = {
  capacity: number;
  shape: SeatingTable["shape"];
  busy: boolean;
  onCapacity: (n: number) => void;
  onShape: (shape: SeatingTable["shape"]) => void;
  onAdd: () => void;
  onPropose: () => void;
};
export default function SeatingTools({
  capacity,
  shape,
  busy,
  onCapacity,
  onShape,
  onAdd,
  onPropose,
}: Props) {
  return (
    <section className="seating-tools seating-setup-card">
      <header>
        <Icon name="table" />
        <div>
          <h3>Añade mesas</h3>
          <p>Elige su tamaño y forma antes de colocarlas.</p>
        </div>
      </header>
      <div className="seating-create-fields">
        <label>
          Asientos por mesa
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
          <Listbox
            value={shape}
            onValueChange={(value) => onShape(value as SeatingTable["shape"])}
          >
            <option value="round">Circular</option>
            <option value="rectangle">Rectangular</option>
          </Listbox>
        </label>
        <button type="button" disabled={busy} onClick={onAdd}>
          <Icon name="plus" /> Añadir mesa
        </button>
      </div>
      <div className="seating-auto-help">
        <button type="button" disabled={busy} onClick={onPropose}>
          <Icon name="users" /> Completar por categoría
        </button>
        <small>
          Revisa la propuesta antes de aplicarla. Respeta tus asignaciones
          actuales.
        </small>
      </div>
    </section>
  );
}
