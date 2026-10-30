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
    <section className="seating-tools seating-setup-card seating-automation-card">
      <header>
        <Icon name="users" />
        <div>
          <h3>Distribuye a tus invitados automáticamente</h3>
          <p>
            Generamos las mesas necesarias y ubicamos a los confirmados por
            categoría.
          </p>
        </div>
      </header>
      <ul className="seating-automation-benefits">
        <li>
          <Icon name="check" />
          Titular y acompañantes juntos
        </li>
        <li>
          <Icon name="check" />
          Respeta los cupos y tus asignaciones
        </li>
      </ul>
      <div className="seating-automation-start">
        <label>
          Asientos por mesa nueva
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
        <button
          type="button"
          className="office-button"
          disabled={busy}
          onClick={onPropose}
        >
          <Icon name="users" />
          Generar propuesta automática
        </button>
      </div>
      <small className="seating-automation-review">
        Primero revisas la propuesta. Solo se aplica cuando tú lo decides y se
        conserva al guardar el plano.
      </small>
      <details className="seating-manual-option">
        <summary>También puedes añadir una mesa a mano</summary>
        <div className="seating-manual-fields">
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
            <Icon name="plus" />
            Añadir mesa
          </button>
        </div>
        <small>
          Se creará con {capacity} asientos. Después puedes editarla o moverla
          en el plano.
        </small>
      </details>
    </section>
  );
}
