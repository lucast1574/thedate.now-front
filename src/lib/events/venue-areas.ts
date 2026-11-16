import {
  type Translator,
  spanishTranslator,
  localized,
} from "@/lib/i18n/translator";
export type VenueArea = {
  id: string;
  name: string;
  kind: "snacks" | "bar" | "stage" | "dance" | "lounge" | "photo" | "entrance";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
};
export const exampleVenueAreas = (
  i18n: Translator = spanishTranslator,
): VenueArea[] => [
  {
    id: "area-snacks",
    name: i18n("Mesa de bocaditos"),
    kind: "snacks",
    x: 110,
    y: 90,
    width: 280,
    height: 120,
  },
  {
    id: "area-bar",
    name: i18n("Bar"),
    kind: "bar",
    x: 1250,
    y: 90,
    width: 210,
    height: 120,
  },
  {
    id: "area-dance",
    name: i18n("Pista de baile"),
    kind: "dance",
    x: 610,
    y: 370,
    width: 380,
    height: 290,
  },
];
export function moveVenueArea(
  area: VenueArea,
  x: number,
  y: number,
  width: number,
  height: number,
  viewport = { width, height },
): VenueArea {
  const { offsetX, offsetY } = venueAreaGeometry(area, width, height, viewport);
  return {
    ...area,
    x: Math.max(offsetX, Math.min(width - area.width - offsetX, x)),
    y: Math.max(offsetY, Math.min(height - area.height - offsetY, y)),
  };
}

export function venueAreaGeometry(
  area: VenueArea,
  width: number,
  height: number,
  viewport = { width, height },
) {
  const sx = viewport.width / width;
  const sy = viewport.height / height;
  const radians = ((area.rotation || 0) * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  const visualWidth = area.width * sx * cos + area.height * sy * sin;
  const visualHeight = area.width * sx * sin + area.height * sy * cos;
  const scale = Math.min(
    1,
    viewport.width / visualWidth,
    viewport.height / visualHeight,
  );
  return {
    scale,
    offsetX: ((visualWidth * scale) / sx - area.width) / 2,
    offsetY: ((visualHeight * scale) / sy - area.height) / 2,
  };
}

export const venueAreaKinds = localized(
  (
    i18n: Translator,
  ): {
    kind: VenueArea["kind"];
    name: string;
    width: number;
    height: number;
  }[] => [
    { kind: "stage", name: i18n("Escenario"), width: 420, height: 140 },
    { kind: "dance", name: i18n("Pista de baile"), width: 380, height: 290 },
    {
      kind: "snacks",
      name: i18n("Mesa de bocaditos"),
      width: 280,
      height: 120,
    },
    { kind: "bar", name: i18n("Bar"), width: 210, height: 120 },
    { kind: "lounge", name: i18n("Zona de descanso"), width: 320, height: 180 },
    { kind: "photo", name: i18n("Zona de fotos"), width: 240, height: 180 },
    { kind: "entrance", name: i18n("Entrada"), width: 180, height: 100 },
  ],
);
export function newVenueArea(
  kind: VenueArea["kind"],
  id: string,
  i18n: Translator = spanishTranslator,
): VenueArea {
  const preset =
    venueAreaKinds(i18n).find((item) => item.kind === kind) ||
    venueAreaKinds(i18n)[0];
  return {
    ...preset,
    id,
    x: Math.round((1600 - preset.width) / 2),
    y: Math.round((1000 - preset.height) / 2),
  };
}
