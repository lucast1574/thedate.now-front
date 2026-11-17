import { useTranslator } from "@/lib/i18n/react";
import type { Person } from "@/lib/events/seating";
import Icon from "@/components/icon";
import Listbox from "@/components/listbox";

export default function GuestCompanionFields({
  value,
  disabled,
  onChange,
}: {
  value?: Person;
  disabled: boolean;
  onChange: (person?: Person) => void;
}) {
  const i18n = useTranslator();
  const person = value || {
    name: "",
    lastName: "",
    gender: "unspecified" as const,
  };
  function patch(fields: Partial<Person>) {
    const next = { ...person, ...fields };
    onChange(
      !next.name.trim() &&
        !next.lastName.trim() &&
        next.gender === "unspecified"
        ? undefined
        : next,
    );
  }
  return (
    <section
      className="manual-companion"
      aria-label={i18n("Datos del acompañante")}
    >
      <header>
        <div>
          <Icon name="lucide:user-plus" />
          <h4>{i18n("Acompañante +1")}</h4>
        </div>
        <span>{i18n("Opcional")}</span>
      </header>
      <p>
        {i18n(
          "Si ya sabes quién lo acompañará, registra sus datos. También puedes dejarlo pendiente para que el invitado lo complete.",
        )}
      </p>
      <div className="manual-companion-fields">
        <label>
          {i18n("Nombre del acompañante")}
          <input
            minLength={2}
            maxLength={120}
            value={person.name}
            required={Boolean(
              person.lastName.trim() || person.gender !== "unspecified",
            )}
            disabled={disabled}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </label>
        <label>
          {i18n("Apellido (opcional)")}
          <input
            maxLength={80}
            value={person.lastName}
            disabled={disabled}
            onChange={(e) => patch({ lastName: e.target.value })}
          />
        </label>
        <label>
          {i18n("Género (opcional)")}
          <Listbox
            value={person.gender}
            disabled={disabled}
            onValueChange={(value) =>
              patch({ gender: value as Person["gender"] })
            }
          >
            <option value="unspecified">{i18n("Sin especificar")}</option>
            <option value="man">{i18n("Hombre")}</option>
            <option value="woman">{i18n("Mujer")}</option>
          </Listbox>
        </label>
      </div>
      {value && (
        <button
          type="button"
          className="manual-companion-clear"
          disabled={disabled}
          onClick={() => onChange(undefined)}
        >
          <Icon name="lucide:rotate-ccw" />
          {i18n("Borrar datos del acompañante")}
        </button>
      )}
    </section>
  );
}
