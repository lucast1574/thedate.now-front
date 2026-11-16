import { useTranslator } from "@/lib/i18n/react";
import { type Translator, localized } from "@/lib/i18n/translator";
import { useState, type Dispatch, type SetStateAction } from "react";
import Listbox from "@/components/listbox";
import type { Event } from "@/lib/events/types";
const durations = localized(
  (i18n: Translator) =>
    [
      [24, i18n("1 día")],
      [48, i18n("2 días · recomendado")],
      [72, i18n("3 días")],
      [168, i18n("1 semana")],
    ] as const,
);
export default function GuestHoldField({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const i18n = useTranslator();

  const [custom, setCustom] = useState(
    !durations(i18n).some(([hours]) => hours === draft.maybeHoldHours),
  );
  return (
    <div className="guest-hold-field">
      <label>
        {i18n("¿Cuánto tiempo damos para confirmar un «Tal vez»?")}{" "}
        <Listbox
          aria-label={i18n("Tiempo para confirmar un Tal vez")}
          value={custom ? "custom" : String(draft.maybeHoldHours)}
          onValueChange={(value) => {
            setCustom(value === "custom");
            if (value !== "custom")
              setDraft((current) => ({
                ...current,
                maybeHoldHours: Number(value),
              }));
          }}
        >
          {durations(i18n).map(([hours, label]) => (
            <option key={hours} value={String(hours)}>
              {label}
            </option>
          ))}
          <option value="custom">{i18n("Elegir otro tiempo")}</option>
        </Listbox>
      </label>
      {custom && (
        <label>
          {i18n("Tiempo en horas")}{" "}
          <input
            required
            type="number"
            min="1"
            max="168"
            value={draft.maybeHoldHours}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                maybeHoldHours: Number(e.target.value),
              }))
            }
          />
        </label>
      )}
      <p className="guest-hold-example">
        <strong>{i18n("Así funciona")}</strong>{" "}
        {i18n("Si alguien responde «Tal vez», reservamos su lugar durante")}{" "}
        {draft.maybeHoldHours === 24
          ? i18n("1 día")
          : draft.maybeHoldHours % 24 === 0
            ? `${draft.maybeHoldHours / 24} días`
            : `${draft.maybeHoldHours} horas`}
        {i18n(
          ", desde su respuesta. Si no confirma a tiempo, el lugar se libera. Podrá confirmar después si todavía hay espacio.",
        )}
      </p>
    </div>
  );
}
