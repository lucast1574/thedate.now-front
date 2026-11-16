import { useTranslator } from "@/lib/i18n/react";
import Icon from "./icon";
import type { Celebration } from "@/lib/events/celebration";
export default function CelebrationAudience({
  value,
  onChange,
}: {
  value: Celebration;
  onChange: (patch: Partial<Celebration>) => void;
}) {
  const i18n = useTranslator();

  return (
    <fieldset className="event-audience">
      <legend>{i18n("¿A quién está dirigida la celebración?")}</legend>
      <div
        className="audience-options"
        role="group"
        aria-label={i18n("Edades de los invitados")}
      >
        <button
          type="button"
          aria-pressed={!value.adultsOnly}
          onClick={() => onChange({ adultsOnly: false })}
        >
          <Icon name="users" /> {i18n("Todas las edades")}
        </button>
        <button
          type="button"
          aria-pressed={value.adultsOnly}
          onClick={() => onChange({ adultsOnly: true })}
        >
          <Icon name="lucide:shield-check" /> {i18n("Solo adultos")}
        </button>
      </div>
      {value.adultsOnly && (
        <>
          <label>
            {i18n("Aviso para tus invitados")}{" "}
            <textarea
              maxLength={500}
              rows={3}
              value={value.adultsMessage}
              onChange={(e) => onChange({ adultsMessage: e.target.value })}
            />
          </label>
          <label className="audience-whatsapp">
            <input
              type="checkbox"
              checked={value.whatsappNotice}
              onChange={(e) => onChange({ whatsappNotice: e.target.checked })}
            />
            <span>
              {i18n("Incluir este aviso en WhatsApp")}{" "}
              <small>
                {i18n("Se añadirá a los próximos envíos después de guardar.")}
              </small>
            </span>
          </label>
        </>
      )}
      <small>
        {i18n(
          "El aviso se usará en las plantillas y, si lo eliges, en WhatsApp. No reenvía mensajes anteriores.",
        )}
      </small>
    </fieldset>
  );
}
