import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Event } from "@/lib/events/types";
import EventResolvedLocation from "./event-resolved-location";
import { useMapAddress } from "./use-map-address";
export default function EventLocationFields({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const [editingUrl, setEditingUrl] = useState<string | null>(null);
  const editing = !!draft.mapUrl.trim() && editingUrl === draft.mapUrl;
  const mapInput = useRef<HTMLInputElement>(null);
  const { mapStatus, setMapStatus, resolvingMap, retry } = useMapAddress(
    draft,
    setDraft,
    editing,
  );
  useEffect(() => {
    mapInput.current?.setCustomValidity(
      !draft.isVirtual && draft.mapUrl.trim() && !draft.location.trim()
        ? "Espera a que encontremos la ubicación. Si la búsqueda falla, puedes corregirla manualmente."
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
                setEditingUrl(null);
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
              Pega el enlace y buscaremos el nombre del lugar y su dirección
              automáticamente.
            </small>
          </label>
          <EventResolvedLocation
            draft={draft}
            setDraft={setDraft}
            editing={editing}
            canCorrect={
              !!draft.mapUrl.trim() &&
              (!!draft.location || (!!mapStatus && !resolvingMap))
            }
            onEdit={() => setEditingUrl(draft.mapUrl)}
          />
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
