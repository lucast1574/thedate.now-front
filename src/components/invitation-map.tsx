"use client";
import { useEffect, useRef, useState } from "react";
import type { FlyerElement } from "@/lib/events/flyer";
import { validMapCoordinates } from "@/lib/events/map-element";
import { invitationMapStyle } from "@/lib/events/map-style";
import Icon from "./icon";
import ElementActionHint from "./element-action-hint";
let protocolReady = false;
export default function InvitationMap({ item }: { item: FlyerElement }) {
  const root = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const {
    mapLatitude: lat,
    mapLongitude: lon,
    mapZoom: zoom = 14,
    mapStyle: style = "natural",
  } = item;
  const valid = validMapCoordinates(item);
  useEffect(() => {
    if (!valid || !root.current) return;
    let disposed = false;
    let map: import("maplibre-gl").Map | undefined;
    const observer = new IntersectionObserver(async (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      try {
        const lib = await import("maplibre-gl");
        if (disposed || !root.current) return;
        if (!protocolReady) {
          lib.setWorkerUrl("/vendor/maplibre/maplibre-gl-worker.mjs");
          lib.addProtocol("osmmap", async (params, abort) => {
            const response = await fetch(
              params.url.replace(/^osmmap:\/\//, "https://"),
              {
                signal: abort.signal,
                credentials: "omit",
                referrerPolicy: "origin",
              },
            );
            if (!response.ok) throw new Error("No se pudo cargar el mapa");
            return {
              data: await response.arrayBuffer(),
              cacheControl: response.headers.get("cache-control") || undefined,
              expires: response.headers.get("expires") || undefined,
            };
          });
          protocolReady = true;
        }
        map = new lib.Map({
          container: root.current,
          style: invitationMapStyle(style),
          center: [lon!, lat!],
          zoom,
          interactive: false,
          attributionControl: false,
          renderWorldCopies: false,
        });
        new lib.Marker({ color: item.color })
          .setLngLat([lon!, lat!])
          .addTo(map);
        map.on("error", () => {
          if (!disposed) setFailed(true);
        });
        map.once("load", () => {
          if (!disposed) setFailed(false);
        });
      } catch {
        if (!disposed) setFailed(true);
      }
    });
    observer.observe(root.current);
    return () => {
      disposed = true;
      observer.disconnect();
      map?.remove();
    };
  }, [valid, lat, lon, zoom, style, item.color]);
  const href = valid
    ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`
    : undefined;
  return (
    <div
      className="invitation-map"
      style={{ borderRadius: `${item.mapRadius || 0}px` }}
    >
      <div
        className="invitation-map-image"
        style={{
          maskImage: item.mapSoftness
            ? `radial-gradient(ellipse, black ${100 - item.mapSoftness}%, transparent 100%)`
            : undefined,
        }}
      >
        <div ref={root} className="invitation-map-canvas" />
        {(!valid || failed) && (
          <span className="invitation-map-placeholder">
            <Icon name="lucide:map-pinned" />
            {valid
              ? "Puedes abrir la ubicación en el mapa"
              : "Configura la ubicación del mapa"}
          </span>
        )}
      </div>
      {href && (
        <a
          className="invitation-map-open"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir ubicación en OpenStreetMap"
        >
          <ElementActionHint item={item} label="Cómo llegar" />
        </a>
      )}
      <a
        className="invitation-map-credit"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
      >
        © OpenStreetMap contributors
      </a>
    </div>
  );
}
