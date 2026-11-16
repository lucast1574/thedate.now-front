import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  return (
    <div className="seating-add-control">
      <Listbox
        value="add"
        aria-label={i18n("Añadir al plano")}
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
          const next = addSeatingItem(plan, value as SeatingAddition, id, i18n);
          if (next) {
            onChange(next);
            onSelect(id);
          }
        }}
      >
        <option value="add" disabled>
          {i18n("Añadir al plano")}
        </option>
        <option value="table">{i18n("Mesa circular · 10 asientos")}</option>
        {venueAreaKinds(i18n).map((item) => (
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
