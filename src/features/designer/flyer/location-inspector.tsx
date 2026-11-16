import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const lookup = useLocationAddress(item.id, item.link || "", (address) =>
    onChange({ address }),
  );
  const invalid = !!item.link && !validMapLink(item.link);
  return (
    <section className="location-inspector">
      <LocationPresentation item={item} onChange={onChange} />
      <div className="inspector-group">
        <h4>{i18n("Destino")}</h4>
        <label>
          {i18n("Dirección")}{" "}
          <textarea
            maxLength={500}
            rows={2}
            value={item.address || ""}
            onChange={(e) => onChange({ address: e.target.value })}
          />
        </label>
        {locationParts(item.locationStyle).includes("label") && (
          <label>
            {i18n("Texto del enlace")}{" "}
            <input
              maxLength={120}
              value={item.text || ""}
              onChange={(e) => onChange({ text: e.target.value })}
              placeholder={i18n("Cómo llegar")}
            />
          </label>
        )}
        <label>
          {i18n("Enlace de Google Maps")}{" "}
          <input
            type="url"
            maxLength={2048}
            value={item.link || ""}
            placeholder={i18n("https://maps.app.goo.gl/…")}
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
              ? i18n("Buscando dirección…")
              : i18n("Completar dirección desde Maps")}
          </button>
        )}
        {lookup.status && (
          <p role="status" className="editor-hint">
            {lookup.status}
          </p>
        )}
        {invalid ? (
          <p role="alert">
            {i18n(
              "Pega un enlace válido de Google Maps o deja el campo vacío para buscar la dirección.",
            )}
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
              {i18n("Abrir en Google Maps")}{" "}
              <small>
                {item.link
                  ? i18n("Comprobar el lugar elegido")
                  : i18n("Buscar esta dirección")}
              </small>
            </span>
            <Icon name="external" />
          </a>
        )}
      </div>
    </section>
  );
}
