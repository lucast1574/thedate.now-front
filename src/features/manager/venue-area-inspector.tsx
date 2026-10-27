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
    <aside className="table-inspector venue-area-inspector">
      <h3>Editar espacio</h3>
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
      <p>
        Este espacio no tiene asientos ni modifica el aforo. Muévelo en el
        lienzo con el ratón o las flechas.
      </p>
      <button
        type="button"
        onClick={() => {
          onChange({
            ...plan,
            areas: plan.areas?.filter((item) => item.id !== area.id),
          });
          onDelete();
        }}
      >
        Quitar espacio
      </button>
    </aside>
  );
}
