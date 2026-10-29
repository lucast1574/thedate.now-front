import { cp, mkdir } from "node:fs/promises";
const destination = new URL("../public/vendor/maplibre/", import.meta.url);
await mkdir(destination, { recursive: true });
await cp(
  new URL(
    "../node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs",
    import.meta.url,
  ),
  new URL("maplibre-gl-worker.mjs", destination),
);
await cp(
  new URL("../node_modules/maplibre-gl/LICENSE.txt", import.meta.url),
  new URL("LICENSE.txt", destination),
);
