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
  if (editing)
    return (
      <label>
        Nombre y dirección del lugar
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
          placeholder="Ej. Hacienda Los Olivos, Lima"
        />
        <small>
          Corrige el texto que verán tus invitados. El enlace de Maps se
          conserva.
        </small>
      </label>
    );
  return (
    <>
      {draft.location && (
        <div className="map-detected-place" role="status">
          <strong>Ubicación de la celebración</strong>
          <p>{draft.location}</p>
        </div>
      )}
      {canCorrect && (
        <button type="button" className="map-retry" onClick={onEdit}>
          {draft.location
            ? "¿No es correcto? Corregir ubicación"
            : "Escribir la ubicación manualmente"}
        </button>
      )}
    </>
  );
}
