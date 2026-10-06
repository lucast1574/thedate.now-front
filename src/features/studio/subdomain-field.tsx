import type { Kind } from "@/lib/events/types";
import { invitationHost } from "@/lib/events/domains";
export default function SubdomainField({
  kind,
  value,
  disabled,
  onChange,
}: {
  kind: Kind;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const wedding = kind === "wedding",
    example = wedding ? "sofiaymateo" : "cumplelucas";
  return (
    <div className="subdomain-field">
      <label htmlFor="invitation-subdomain">Elige tu subdominio</label>
      <div className="subdomain-input">
        <input
          id="invitation-subdomain"
          required
          disabled={disabled}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={63}
          pattern="[a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9]"
          aria-describedby="subdomain-hint subdomain-address"
          value={value}
          onChange={(e) =>
            onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
          }
          placeholder={example}
        />
        <span>{wedding ? ".save.thedate.now" : ".thedate.now"}</span>
      </div>
      <small id="subdomain-hint">
        {wedding
          ? "Queda bonito con sus nombres juntos, por ejemplo: sofiaymateo."
          : "Elige tu nombre o el de tu celebración, por ejemplo: cumplelucas."}
      </small>
      <details className="subdomain-help">
        <summary title="Consejos para elegir una dirección fácil de recordar">
          Cómo elegir una dirección bonita
        </summary>
        <p>
          {wedding
            ? "Sofía y Mateo → sofiaymateo. También puedes usar sofiaymateo2027."
            : "Cumpleaños de Lucas → cumplelucas. También puedes usar fiestaana o encuentro2027."}{" "}
          Usa letras sin tildes, números o guiones, sin espacios. El subdominio
          se reserva al crear el evento.
        </p>
      </details>
      <small id="subdomain-address">
        {disabled ? "Dirección reservada" : "Tu dirección será"}:{" "}
        <strong>{invitationHost(kind, value || example)}</strong>
      </small>
    </div>
  );
}
