import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";

export default function GuestResponseOptions({
  name,
  choice,
  allowMaybe,
  busy,
  onChange,
}: {
  name: string;
  choice: string;
  allowMaybe: boolean;
  busy: boolean;
  onChange: (value: string) => void;
}) {
  const i18n = useTranslator();
  const options = [
    {
      value: "going",
      title: i18n("Sí, asistirá"),
      description: i18n(
        "Confirma su asistencia y conserva a sus acompañantes.",
      ),
      icon: "lucide:user-check",
    },
    {
      value: "not_going",
      title: i18n("No asistirá"),
      description: i18n("Libera sus cupos y los asientos que tenía asignados."),
      icon: "lucide:user-x",
    },
    ...(allowMaybe
      ? [
          {
            value: "maybe",
            title: i18n("Tal vez"),
            description: i18n("Mantiene sus cupos en espera temporal."),
            icon: "lucide:clock",
          },
        ]
      : []),
  ];
  return (
    <fieldset disabled={busy} className="guest-response-options">
      <legend>{i18n("¿Cuál es su respuesta?")}</legend>
      {options.map((option) => (
        <label
          className={`guest-response-choice ${choice === option.value ? "is-selected" : ""}`}
          key={option.value}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={choice === option.value}
            onChange={() => onChange(option.value)}
          />
          <Icon name={option.icon} />
          <span>
            <strong>{option.title}</strong>
            <small>{option.description}</small>
          </span>
          <span className="guest-response-check" aria-hidden="true">
            {choice === option.value && <Icon name="lucide:check" />}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
