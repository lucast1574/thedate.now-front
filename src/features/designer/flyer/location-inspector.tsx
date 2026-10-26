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
      <h4>Ubicación con enlace</h4>
      <p className="editor-hint">
        Elige cómo se verá. Al tocarla, tus invitados abrirán Google Maps.
      </p>
      <div className="location-display-options">
        {(
          [
            ["icon", "Solo icono"],
            ["label", "Texto"],
            ["address", "Dirección"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            aria-pressed={(item.locationStyle || "address") === value}
            onClick={() =>
              onChange({
                locationStyle: value,
                ...(value === "icon"
                  ? { width: 96, height: 96 }
                  : item.locationStyle === "icon"
                    ? { width: 400, height: 120 }
                    : {}),
              })
            }
          >
            {value === "icon" && <Icon name="lucide:map-pin" />}
            {label}
          </button>
        ))}
      </div>
      <label>
        Dirección
        <textarea
          maxLength={500}
          rows={2}
          value={item.address || ""}
          onChange={(e) => onChange({ address: e.target.value })}
        />
      </label>
      {item.locationStyle === "label" && (
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
      {item.link && !invalid && (
        <button disabled={lookup.busy} onClick={() => void lookup.resolve()}>
          {lookup.busy ? "Buscando dirección…" : "Obtener dirección del enlace"}
        </button>
      )}
      {lookup.status && (
        <p role="status" className="editor-hint">
          {lookup.status}
        </p>
      )}
      {invalid ? (
        <p role="alert">
          Pega un enlace válido de Google Maps o deja el campo vacío para buscar
          la dirección.
        </p>
      ) : (
        <p className="editor-hint">
          {item.link
            ? "Se abrirá el lugar exacto de este enlace."
            : "Sin enlace, Maps buscará la dirección que escribiste."}
        </p>
      )}
      {!invalid && locationHref(item) && (
        <a href={locationHref(item)} target="_blank" rel="noopener noreferrer">
          Probar ubicación <Icon name="external" />
        </a>
      )}
    </section>
  );
}
