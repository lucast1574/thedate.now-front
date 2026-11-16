import { useTranslator } from "@/lib/i18n/react";
import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
export default function EventResolvedLocation({
  draft,
  setDraft,
  editing,
  canCorrect,
  onEdit,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
  editing: boolean;
  canCorrect: boolean;
  onEdit: () => void;
}) {
  const i18n = useTranslator();

  if (editing)
    return (
      <label>
        {i18n("Nombre y dirección del lugar")}{" "}
        <input
          autoFocus
          required
          maxLength={500}
          value={draft.location}
          onChange={(e) =>
            setDraft({
              ...draft,
              location: e.target.value,
              isVirtual: false,
              virtualUrl: "",
            })
          }
          placeholder={i18n("Ej. Hacienda Los Olivos, Lima")}
        />
        <small>
          {i18n(
            "Corrige el texto que verán tus invitados. El enlace de Maps se conserva.",
          )}
        </small>
      </label>
    );
  return (
    <>
      {draft.location && (
        <div className="map-detected-place" role="status">
          <strong>{i18n("Ubicación de la celebración")}</strong>
          <p>{draft.location}</p>
        </div>
      )}
      {canCorrect && (
        <button type="button" className="map-retry" onClick={onEdit}>
          {draft.location
            ? i18n("¿No es correcto? Corregir ubicación")
            : i18n("Escribir la ubicación manualmente")}
        </button>
      )}
    </>
  );
}
