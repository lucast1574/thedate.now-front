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
    <div className="venue-area-tools">
      <label>
        Espacios del salón
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
      <small>
        Escenario, bar, bocaditos, pista, fotos, descanso o entrada. Arrastra
        cada espacio y guarda el plano.
      </small>
    </div>
  );
}
