import Icon from "@/components/icon";
import Listbox from "@/components/listbox";
import { venueAreaKinds } from "@/lib/events/venue-areas";
import {
  addSeatingItem,
  type SeatingAddition,
} from "@/lib/events/seating-additions";
import type { SeatingPlan } from "@/lib/events/seating";
const icons: Record<string, string> = {
  table: "table",
  stage: "lucide:mic-vocal",
  dance: "music",
  snacks: "lucide:utensils",
  bar: "lucide:martini",
  lounge: "lucide:sofa",
  photo: "lucide:camera",
  entrance: "lucide:door-open",
};
export default function SeatingAddMenu({
  plan,
  onChange,
  onSelect,
}: {
  plan: SeatingPlan;
  onChange: (plan: SeatingPlan) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="seating-add-control">
      <Listbox
        value="add"
        aria-label="Añadir al plano"
        menuMinWidth={250}
        renderLabel={(option, trigger) =>
          trigger ? (
            <Icon name="plus" />
          ) : (
            <span className="seating-add-choice">
              <Icon name={icons[option.value] || "plus"} />
              {option.label}
            </span>
          )
        }
        onValueChange={(value) => {
          const id = crypto.randomUUID();
          const next = addSeatingItem(plan, value as SeatingAddition, id);
          if (next) {
            onChange(next);
            onSelect(id);
          }
        }}
      >
        <option value="add" disabled>
          Añadir al plano
        </option>
        <option value="table">Mesa circular · 10 asientos</option>
        {venueAreaKinds.map((item) => (
          <option
            key={item.kind}
            value={item.kind}
            disabled={(plan.areas?.length || 0) >= 30}
          >
            {item.name}
          </option>
        ))}
      </Listbox>
    </div>
  );
}
