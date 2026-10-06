import type { Person } from "@/lib/events/seating";
export default function CompanionFields({
  people,
  max,
  onChange,
  description = "El titular ya está incluido. Añade solo a quienes asistirán contigo.",
}: {
  description?: string;
  people: Person[];
  max: number;
  onChange: (people: Person[]) => void;
}) {
  function patch(index: number, fields: Partial<Person>) {
    onChange(
      people.map((person, n) =>
        n === index ? { ...person, ...fields } : person,
      ),
    );
  }
  return (
    <section className="companion-fields">
      <h3>
        Acompañantes · {people.length}/{max}
      </h3>
      <p>{description}</p>
      {people.map((person, n) => (
        <fieldset key={n}>
          <legend>Acompañante {n + 1}</legend>
          <label>
            Nombre
            <input
              required
              minLength={2}
              maxLength={120}
              value={person.name}
              onChange={(e) => patch(n, { name: e.target.value })}
            />
          </label>
          <label>
            Apellido
            <input
              maxLength={80}
              value={person.lastName}
              onChange={(e) => patch(n, { lastName: e.target.value })}
            />
          </label>
          <label>
            Icono
            <select
              value={person.gender}
              onChange={(e) =>
                patch(n, { gender: e.target.value as Person["gender"] })
              }
            >
              <option value="unspecified">Sin especificar</option>
              <option value="man">Hombre</option>
              <option value="woman">Mujer</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => onChange(people.filter((_, index) => n !== index))}
          >
            Quitar acompañante
          </button>
        </fieldset>
      ))}
      {people.length < max && (
        <button
          type="button"
          onClick={() =>
            onChange([
              ...people,
              { name: "", lastName: "", gender: "unspecified" },
            ])
          }
        >
          ＋ Añadir acompañante
        </button>
      )}
    </section>
  );
}
