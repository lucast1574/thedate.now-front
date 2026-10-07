import type { Kind } from "@/lib/events/types";
import { invitationHost } from "@/lib/events/domains";
import Icon from "@/components/icon";
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
    <div className="invitation-address-card">
      <Icon name="external" />
      <div>
        <small>
          {disabled ? "Tu enlace reservado" : "Así se verá tu enlace"}
        </small>
        <strong id="subdomain-address">
          {invitationHost(kind, value || example)}
        </strong>
        <span>Podrás compartirlo cuando publiques tu invitación.</span>
      </div>
      {!disabled && (
        <details className="address-edit">
          <summary>Personalizar enlace</summary>
          <div className="subdomain-field">
            <label htmlFor="invitation-subdomain">
              Elige el nombre de tu enlace
            </label>
            <div className="subdomain-input">
              <input
                id="invitation-subdomain"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                maxLength={63}
                pattern="[a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9]"
                aria-describedby="subdomain-hint subdomain-address"
                value={value}
                onChange={(e) =>
                  onChange(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                placeholder={example}
              />
              <span>{wedding ? ".save.thedate.now" : ".thedate.now"}</span>
            </div>
            <small id="subdomain-hint">
              {wedding
                ? "Sus nombres juntos quedan bonitos: sofiaymateo."
                : "Usa tu nombre o el de tu celebración: cumplelucas."}{" "}
              Sin espacios ni tildes.
            </small>
          </div>
        </details>
      )}
    </div>
  );
}
