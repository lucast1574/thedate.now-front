import LocationPresentation from "./location-presentation";
import { locationParts } from "@/lib/events/location-element";
import { useLocationAddress } from "./use-location-address";
import Icon from "@/components/icon";
import type { FlyerElement } from "@/lib/events/flyer";
import { validMapLink, locationHref } from "@/lib/events/location-element";
export default function LocationInspector({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const lookup = useLocationAddress(item.id, item.link || "", (address) =>
    onChange({ address }),
  );
  const invalid = !!item.link && !validMapLink(item.link);
  return (
    <section className="location-inspector">
      <LocationPresentation item={item} onChange={onChange} />
      <div className="inspector-group">
        <h4>Destino</h4>
        <label>
          Dirección
          <textarea
            maxLength={500}
            rows={2}
            value={item.address || ""}
            onChange={(e) => onChange({ address: e.target.value })}
          />
        </label>
        {locationParts(item.locationStyle).includes("label") && (
          <label>
            Texto del enlace
            <input
              maxLength={120}
              value={item.text || ""}
              onChange={(e) => onChange({ text: e.target.value })}
              placeholder="Cómo llegar"
            />
          </label>
        )}
        <label>
          Enlace de Google Maps
          <input
            type="url"
            maxLength={2048}
            value={item.link || ""}
            placeholder="https://maps.app.goo.gl/…"
            aria-invalid={invalid}
            onChange={(e) => onChange({ link: e.target.value.trim() })}
          />
        </label>
        {item.link && !invalid && !item.address?.trim() && (
          <button
            className="inspector-secondary-action"
            disabled={lookup.busy}
            onClick={() => void lookup.resolve()}
          >
            <Icon name="lucide:map-pin-plus" />
            {lookup.busy
              ? "Buscando dirección…"
              : "Completar dirección desde Maps"}
          </button>
        )}
        {lookup.status && (
          <p role="status" className="editor-hint">
            {lookup.status}
          </p>
        )}
        {invalid ? (
          <p role="alert">
            Pega un enlace válido de Google Maps o deja el campo vacío para
            buscar la dirección.
          </p>
        ) : null}
        {!invalid && locationHref(item) && (
          <a
            className="inspector-map-preview"
            href={locationHref(item)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="lucide:map-pin" />
            <span>
              Abrir en Google Maps
              <small>
                {item.link
                  ? "Comprobar el lugar elegido"
                  : "Buscar esta dirección"}
              </small>
            </span>
            <Icon name="external" />
          </a>
        )}
      </div>
    </section>
  );
}
