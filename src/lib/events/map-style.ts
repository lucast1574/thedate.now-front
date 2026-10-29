import type { StyleSpecification } from "maplibre-gl";
export function invitationMapStyle(style = "natural"): StyleSpecification {
  const colors =
    style === "ink"
      ? ["#f5f4f0", "#dfdfda", "#d0d0c8", "#ffffff", "#a3a39a"]
      : style === "warm"
        ? ["#f5eee2", "#d7e1df", "#e6dcc9", "#fffaf2", "#bca88e"]
        : ["#f4f3ed", "#bed9e4", "#dbe5cd", "#ffffff", "#c1b9ac"];
  return {
    version: 8,
    glyphs: "osmmap://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
    sources: {
      osm: {
        type: "vector",
        tiles: [
          (
            process.env.NEXT_PUBLIC_OSM_VECTOR_TILES ||
            "https://vector.openstreetmap.org/shortbread_v1/{z}/{x}/{y}.mvt"
          ).replace(/^https:\/\//, "osmmap://"),
        ],
        maxzoom: 14,
      },
    },
    layers: [
      {
        id: "paper",
        type: "background",
        paint: { "background-color": colors[0] },
      },
      ...["ocean", "water_polygons"].map((layer) => ({
        id: layer,
        type: "fill" as const,
        source: "osm",
        "source-layer": layer,
        paint: { "fill-color": colors[1] },
      })),
      {
        id: "land",
        type: "fill",
        source: "osm",
        "source-layer": "land",
        paint: { "fill-color": colors[2], "fill-opacity": 0.65 },
      },
      {
        id: "buildings",
        type: "fill",
        source: "osm",
        "source-layer": "buildings",
        paint: { "fill-color": colors[4], "fill-opacity": 0.35 },
      },
      {
        id: "roads",
        type: "line",
        source: "osm",
        "source-layer": "streets",
        paint: {
          "line-color": colors[3],
          "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1, 16, 5],
        },
      },
      ...["street_labels", "place_labels"].map((layer) => ({
        id: layer,
        type: "symbol" as const,
        source: "osm",
        "source-layer": layer,
        layout: {
          "text-field": ["get", "name"] as ["get", string],
          "text-font": ["Open Sans Regular"],
          "text-size": layer === "place_labels" ? 13 : 11,
          "symbol-placement":
            layer === "street_labels" ? ("line" as const) : ("point" as const),
        },
        paint: {
          "text-color": "#635d54",
          "text-halo-color": colors[0],
          "text-halo-width": 1,
        },
      })),
    ],
  };
}
