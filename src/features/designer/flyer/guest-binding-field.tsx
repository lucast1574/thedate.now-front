import Icon from "@/components/icon";
import { guestNameToken } from "@/lib/events/guest-name";
export default function GuestBindingField({
  text,
  onChange,
}: {
  text: string;
  onChange: (text: string) => void;
}) {
  const [before, ...after] = text.split(guestNameToken);
  const suffix = after.join("");
  return (
    <section className="guest-binding-field" aria-label="Texto personalizado">
      <label>
        Antes del nombre
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
        <Icon name="users" /> Nombre del invitado <Icon name="lock" />
      </span>
      <label>
        Después del nombre
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
        Cada persona verá su propio nombre. Puedes editar el saludo y el estilo;
        el dato permanece protegido.
      </p>
    </section>
  );
}
