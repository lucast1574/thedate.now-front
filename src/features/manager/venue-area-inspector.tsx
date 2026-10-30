import RemoveSeatingItem from "./remove-seating-item";
import type { SeatingPlan } from "@/lib/events/seating";
import { moveVenueArea, type VenueArea } from "@/lib/events/venue-areas";
export default function VenueAreaInspector({
  area,
  plan,
  onChange,
  onDelete,
}: {
  area: VenueArea;
  plan: SeatingPlan;
  onChange: (plan: SeatingPlan) => void;
  onDelete: () => void;
}) {
  function patch(value: Partial<VenueArea>) {
    const next = moveVenueArea(
      { ...area, ...value },
      value.x ?? area.x,
      value.y ?? area.y,
      plan.width,
      plan.height,
    );
    onChange({
      ...plan,
      areas: plan.areas?.map((item) => (item.id === area.id ? next : item)),
    });
  }
  return (
    <aside className="table-inspector venue-area-inspector table-organizer">
      <header className="table-organizer-heading">
        <small>Espacio seleccionado</small>
        <h3>{area.name}</h3>
        <p>Ajusta sus dimensiones sin modificar el aforo.</p>
      </header>
      <div className="table-properties">
        <label>
          Nombre
          <input
            maxLength={100}
            value={area.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </label>
        <label>
          Ancho · {area.width}
          <input
            type="range"
            min={80}
            max={800}
            step={10}
            value={area.width}
            onChange={(e) => patch({ width: Number(e.target.value) })}
          />
        </label>
        <label>
          Alto · {area.height}
          <input
            type="range"
            min={60}
            max={600}
            step={10}
            value={area.height}
            onChange={(e) => patch({ height: Number(e.target.value) })}
          />
        </label>
      </div>
      <p>
        Este espacio no tiene asientos ni modifica el aforo. Muévelo en el
        lienzo con el ratón o las flechas.
      </p>
      <RemoveSeatingItem
        name={area.name}
        description="Se quitará este espacio del borrador. Las mesas y las personas conservarán su posición."
        onRemove={() => {
          onChange({
            ...plan,
            areas: plan.areas?.filter((item) => item.id !== area.id),
          });
          onDelete();
        }}
      />
    </aside>
  );
}
