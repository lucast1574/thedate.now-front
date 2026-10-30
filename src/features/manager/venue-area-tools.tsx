import { useState } from "react";
import Listbox from "@/components/listbox";
import Icon from "@/components/icon";
import type { SeatingPlan } from "@/lib/events/seating";
import {
  newVenueArea,
  venueAreaKinds,
  type VenueArea,
} from "@/lib/events/venue-areas";
export default function VenueAreaTools({
  plan,
  onChange,
  onSelect,
}: {
  plan: SeatingPlan;
  onChange: (plan: SeatingPlan) => void;
  onSelect: (id: string) => void;
}) {
  const [kind, setKind] = useState<VenueArea["kind"]>("stage");
  return (
    <section className="venue-area-tools seating-setup-card">
      <header>
        <Icon name="lucide:map-pin" />
        <div>
          <h3>Espacios del salón</h3>
          <p>Señala las zonas que acompañan a las mesas.</p>
        </div>
      </header>
      <div className="seating-area-fields">
        <label>
          Tipo de espacio
          <Listbox
            value={kind}
            onValueChange={(value) => setKind(value as VenueArea["kind"])}
          >
            {venueAreaKinds.map((item) => (
              <option key={item.kind} value={item.kind}>
                {item.name}
              </option>
            ))}
          </Listbox>
        </label>
        <button
          type="button"
          disabled={(plan.areas?.length || 0) >= 30}
          onClick={() => {
            const area = newVenueArea(kind, crypto.randomUUID());
            onChange({ ...plan, areas: [...(plan.areas || []), area] });
            onSelect(area.id);
          }}
        >
          <Icon name="plus" />
          Añadir espacio
        </button>
      </div>
      <small>
        Escenario, bar, pista de baile, fotos y más. Puedes moverlos después en
        el plano; no ocupan asientos.
      </small>
      <div className="seating-space-tip">
        <Icon name="lucide:move" />
        <span>
          <strong>Haz espacio para cada momento</strong>
          Añade una zona y arrástrala en el plano hasta donde quieras colocarla.
        </span>
      </div>
    </section>
  );
}
