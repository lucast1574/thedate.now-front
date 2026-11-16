import { useTranslator } from "@/lib/i18n/react";
import type { Kind } from "@/lib/events/types";
import { invitationHost, validInvitationSlug } from "@/lib/events/domains";
import { useEffect, useRef } from "react";
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
  const i18n = useTranslator();

  const wedding = kind === "wedding",
    example = wedding ? "sofiaymateo" : "cumplelucas";
  const input = useRef<HTMLInputElement>(null);
  const invalid = !!value && !validInvitationSlug(value);
  useEffect(() => {
    input.current?.setCustomValidity(
      invalid
        ? i18n("Ese nombre está reservado o no es válido. Elige otro enlace.")
        : "",
    );
  }, [invalid, disabled, i18n]);
  return (
    <div className="invitation-address-card">
      <Icon name="external" />
      <div>
        <small>
          {disabled
            ? i18n("Tu enlace reservado")
            : i18n("Así se verá tu enlace")}
        </small>
        <strong id="subdomain-address">
          {invalid
            ? i18n("Elige otro nombre para tu enlace")
            : invitationHost(kind, value || example)}
        </strong>
        <span>
          {i18n("Podrás compartirlo cuando publiques tu invitación.")}
        </span>
      </div>
      {!disabled && (
        <details className="address-edit">
          <summary>{i18n("Personalizar enlace")}</summary>
          <div className="subdomain-field">
            <label htmlFor="invitation-subdomain">
              {i18n("Elige el nombre de tu enlace")}
            </label>
            <div className="subdomain-input">
              <input
                ref={input}
                aria-invalid={invalid}
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
            {invalid && (
              <small role="alert">
                {i18n(
                  "Ese nombre está reservado o no es válido. Elige otro; «save» pertenece a Save the Date.",
                )}
              </small>
            )}
            <small id="subdomain-hint">
              {wedding
                ? i18n("Sus nombres juntos quedan bonitos: sofiaymateo.")
                : i18n(
                    "Usa tu nombre o el de tu celebración: cumplelucas.",
                  )}{" "}
              {i18n(
                "Sin espacios ni tildes. Si cambias el nombre del evento antes de publicar, el enlace se actualizará también.",
              )}
            </small>
          </div>
        </details>
      )}
    </div>
  );
}
