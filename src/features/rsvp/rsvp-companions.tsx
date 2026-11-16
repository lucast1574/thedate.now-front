import { useTranslator } from "@/lib/i18n/react";
import CompanionFields from "@/components/companion-fields";
import type { Person } from "@/lib/events/seating";
export default function RSVPCompanions({
  people,
  max,
  onChange,
}: {
  people: Person[];
  max: number;
  onChange: (people: Person[]) => void;
}) {
  const i18n = useTranslator();

  return (
    <>
      <fieldset>
        <legend>{i18n("¿Vendrás con acompañantes?")}</legend>
        <label>
          <input
            type="radio"
            name="with-companions"
            checked={!people.length}
            onChange={() => onChange([])}
          />{" "}
          {i18n("No, iré solo")}
        </label>
        <label>
          <input
            type="radio"
            name="with-companions"
            checked={people.length > 0}
            onChange={() => {
              if (!people.length)
                onChange([{ name: "", lastName: "", gender: "unspecified" }]);
            }}
          />{" "}
          {i18n("Sí, iré acompañado")}
        </label>
      </fieldset>
      {people.length > 0 && (
        <CompanionFields
          people={people}
          max={max}
          onChange={onChange}
          description={i18n(
            "Registra el nombre de cada persona que irá contigo.",
          )}
        />
      )}
    </>
  );
}
