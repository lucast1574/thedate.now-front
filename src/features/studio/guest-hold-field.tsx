import { useState, type Dispatch, type SetStateAction } from "react";
import Listbox from "@/components/listbox";
import type { Event } from "@/lib/events/types";
const durations = [
  [24, "1 día"],
  [48, "2 días · recomendado"],
  [72, "3 días"],
  [168, "1 semana"],
] as const;
export default function GuestHoldField({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const [custom, setCustom] = useState(
    !durations.some(([hours]) => hours === draft.maybeHoldHours),
  );
  return (
    <div className="guest-hold-field">
      <label>
        ¿Cuánto tiempo damos para confirmar un «Tal vez»?
        <Listbox
          aria-label="Tiempo para confirmar un Tal vez"
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
          {durations.map(([hours, label]) => (
            <option key={hours} value={String(hours)}>
              {label}
            </option>
          ))}
          <option value="custom">Elegir otro tiempo</option>
        </Listbox>
      </label>
      {custom && (
        <label>
          Tiempo en horas
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
        <strong>Así funciona</strong> Si alguien responde «Tal vez», reservamos
        su lugar durante{" "}
        {draft.maybeHoldHours === 24
          ? "1 día"
          : draft.maybeHoldHours % 24 === 0
            ? `${draft.maybeHoldHours / 24} días`
            : `${draft.maybeHoldHours} horas`}
        , desde su respuesta. Si no confirma a tiempo, el lugar se libera. Podrá
        confirmar después si todavía hay espacio.
      </p>
    </div>
  );
}
