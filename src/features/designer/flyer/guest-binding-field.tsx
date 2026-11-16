import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
import { guestNameToken } from "@/lib/events/guest-name";
export default function GuestBindingField({
  text,
  onChange,
}: {
  text: string;
  onChange: (text: string) => void;
}) {
  const i18n = useTranslator();

  const [before, ...after] = text.split(guestNameToken);
  const suffix = after.join("");
  return (
    <section
      className="guest-binding-field"
      aria-label={i18n("Texto personalizado")}
    >
      <label>
        {i18n("Antes del nombre")}{" "}
        <input
          maxLength={900}
          value={before}
          onChange={(e) =>
            onChange(
              e.target.value.replaceAll(guestNameToken, "") +
                guestNameToken +
                suffix,
            )
          }
        />
      </label>
      <span className="guest-data-chip">
        <Icon name="users" /> {i18n("Nombre del invitado")} <Icon name="lock" />
      </span>
      <label>
        {i18n("Después del nombre")}{" "}
        <input
          maxLength={900}
          value={suffix}
          onChange={(e) =>
            onChange(
              before +
                guestNameToken +
                e.target.value.replaceAll(guestNameToken, ""),
            )
          }
        />
      </label>
      <p className="editor-hint">
        {i18n(
          "Cada persona verá su propio nombre. Puedes editar el saludo y el estilo; el dato permanece protegido.",
        )}
      </p>
    </section>
  );
}
