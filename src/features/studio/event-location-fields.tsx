import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import { useMapAddress } from "./use-map-address";
export default function EventLocationFields({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const mapInput = useRef<HTMLInputElement>(null);
  const { mapStatus, setMapStatus, resolvingMap, retry } = useMapAddress(
    draft,
    setDraft,
  );
  useEffect(() => {
    mapInput.current?.setCustomValidity(
      !draft.isVirtual && draft.mapUrl.trim() && !draft.location.trim()
        ? "Escribe el nombre y la dirección del lugar o espera a que los encontremos con Google Maps."
        : "",
    );
  }, [draft.isVirtual, draft.mapUrl, draft.location]);
  return (
    <>
      {draft.kind !== "wedding" && (
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
      {draft.isVirtual && draft.kind !== "wedding" ? (
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
        <div className="event-map-location">
          <label>
            Enlace de Google Maps
            <input
              required
              type="url"
              ref={mapInput}
              maxLength={2048}
              value={draft.mapUrl}
              onChange={(e) => {
                setDraft({
                  ...draft,
                  mapUrl: e.target.value,
                  location: "",
                  isVirtual: false,
                  virtualUrl: "",
                });
                setMapStatus("");
              }}
              placeholder="https://maps.app.goo.gl/..."
            />
            <small>
              Pega el enlace y buscaremos la dirección automáticamente.
            </small>
          </label>
          <label>
            Nombre y dirección del lugar
            <input
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
              Lo completamos con Maps. Puedes escribir o corregir el lugar
              directamente.
            </small>
          </label>
          {mapStatus && !resolvingMap && !draft.location && (
            <button className="map-retry" type="button" onClick={retry}>
              Volver a buscar la ubicación
            </button>
          )}
        </div>
      )}
      {!draft.isVirtual && mapStatus && (
        <p
          role="status"
          className={`map-status ${resolvingMap ? "loading" : ""}`}
        >
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
