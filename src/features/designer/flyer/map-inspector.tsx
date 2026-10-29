import { useRef, useEffect, useState } from "react";
import Listbox from "@/components/listbox";
import { api } from "@/lib/api/client";
import type { FlyerElement } from "@/lib/events/flyer";
import { mapCoordinates, validMapCoordinates } from "@/lib/events/map-element";
export default function MapInspector({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const [link, setLink] = useState(item.link || "");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
    },
    [item.id],
  );
  async function locate() {
    const attempt = ++generation.current;
    setBusy(true);
    setError("");
    try {
      const coordinates = mapCoordinates(link);
      const result =
        validMapCoordinates({ ...item, ...coordinates }) &&
        coordinates.mapLatitude !== undefined
          ? {
              latitude: coordinates.mapLatitude,
              longitude: coordinates.mapLongitude,
            }
          : await api<{ latitude: number; longitude: number }>(
              "/api/backend/maps/resolve",
              "POST",
              { url: link },
            );
      if (attempt === generation.current)
        onChange({
          mapLatitude: result.latitude,
          mapLongitude: result.longitude,
          eventBound: false,
          link: "",
        });
    } catch (err) {
      if (attempt === generation.current) setError((err as Error).message);
    } finally {
      if (attempt === generation.current) setBusy(false);
    }
  }
  return (
    <div className="inspector-group">
      <p className="editor-hint">
        Pega el enlace del lugar. El mapa mostrará un marcador en esa ubicación.
      </p>
      <label>
        Enlace de Google Maps
        <input
          value={link}
          type="url"
          maxLength={2048}
          placeholder="https://maps.app.goo.gl/…"
          onChange={(e) => {
            generation.current++;
            setBusy(false);
            setLink(e.target.value);
          }}
        />
      </label>
      <button disabled={busy || !link.trim()} onClick={() => void locate()}>
        {busy ? "Buscando ubicación…" : "Ubicar en el mapa"}
      </button>
      {error && <p role="alert">{error}</p>}
      <label>
        Estilo del mapa
        <Listbox
          value={item.mapStyle || "natural"}
          onValueChange={(mapStyle) =>
            onChange({ mapStyle: mapStyle as FlyerElement["mapStyle"] })
          }
        >
          <option value="natural">Natural</option>
          <option value="warm">Papel cálido</option>
          <option value="ink">Tinta suave</option>
        </Listbox>
      </label>
      <label>
        Acercamiento
        <input
          type="range"
          min={3}
          max={18}
          value={item.mapZoom || 14}
          onChange={(e) => onChange({ mapZoom: Number(e.target.value) })}
        />
      </label>
      <label>
        Esquinas redondeadas
        <input
          type="range"
          min={0}
          max={80}
          value={item.mapRadius || 0}
          onChange={(e) => onChange({ mapRadius: Number(e.target.value) })}
        />
      </label>
      <label>
        Suavizar bordes
        <input
          type="range"
          min={0}
          max={35}
          value={item.mapSoftness || 0}
          onChange={(e) => onChange({ mapSoftness: Number(e.target.value) })}
        />
      </label>
    </div>
  );
}
