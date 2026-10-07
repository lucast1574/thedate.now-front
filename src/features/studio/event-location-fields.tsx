import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import { useMapAddress } from "./use-map-address";
export default function EventLocationFields({
  draft,
  setDraft,
  savedMapURL,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
  savedMapURL?: string;
}) {
  const wedding = draft.kind === "wedding";
  const { mapStatus, setMapStatus, resolvingMap } = useMapAddress(
    draft,
    setDraft,
    savedMapURL,
  );
  return (
    <>
      {!wedding && (
        <fieldset className="event-mode">
          <legend>¿Cómo se van a reunir?</legend>
          <label>
            <input
              type="radio"
              name="event-mode"
              checked={!draft.isVirtual}
              onChange={() => {
                setDraft({
                  ...draft,
                  isVirtual: false,
                  virtualUrl: "",
                  location: "",
                });
                setMapStatus("");
              }}
            />{" "}
            En un lugar
          </label>
          <label>
            <input
              type="radio"
              name="event-mode"
              checked={draft.isVirtual}
              onChange={() => {
                setDraft({
                  ...draft,
                  isVirtual: true,
                  mapUrl: "",
                  location: "",
                });
                setMapStatus("");
              }}
            />{" "}
            Por internet
          </label>
        </fieldset>
      )}
      {draft.isVirtual ? (
        <label>
          Enlace para unirse
          <input
            required
            type="url"
            value={draft.virtualUrl}
            onChange={(e) => setDraft({ ...draft, virtualUrl: e.target.value })}
            placeholder="https://meet.google.com/..."
          />
          <small>Los invitados verán este enlace en su invitación.</small>
        </label>
      ) : (
        <div className="form-grid">
          <label>
            Enlace de Google Maps
            <input
              required
              type="url"
              value={draft.mapUrl}
              onChange={(e) => {
                setDraft({ ...draft, mapUrl: e.target.value });
                setMapStatus("");
              }}
              placeholder="https://maps.app.goo.gl/..."
            />
            <small>
              Pega el enlace y buscaremos la dirección automáticamente.
            </small>
          </label>
          <label>
            Nombre o dirección del lugar
            <input
              required
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              placeholder="Ej. Hacienda Los Olivos, Lima"
            />
            <small>También podemos completarlo con el enlace de Maps.</small>
          </label>
        </div>
      )}
      {!draft.isVirtual && mapStatus && (
        <p className={`map-status ${resolvingMap ? "loading" : ""}`}>
          {mapStatus.includes("OpenStreetMap") ? (
            <>
              {mapStatus.replace(" © OpenStreetMap contributors", "")}{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
              >
                © OpenStreetMap contributors
              </a>
            </>
          ) : (
            mapStatus
          )}
        </p>
      )}
    </>
  );
}
