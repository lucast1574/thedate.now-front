export type VenueArea = {
  id: string;
  name: string;
  kind: "snacks" | "bar" | "stage" | "dance" | "lounge" | "photo" | "entrance";
  x: number;
  y: number;
  width: number;
  height: number;
};
export const exampleVenueAreas = (): VenueArea[] => [
  {
    id: "area-snacks",
    name: "Mesa de bocaditos",
    kind: "snacks",
    x: 110,
    y: 90,
    width: 280,
    height: 120,
  },
  {
    id: "area-bar",
    name: "Bar",
    kind: "bar",
    x: 1250,
    y: 90,
    width: 210,
    height: 120,
  },
  {
    id: "area-dance",
    name: "Pista de baile",
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
): VenueArea {
  return {
    ...area,
    x: Math.round(Math.max(0, Math.min(width - area.width, x))),
    y: Math.round(Math.max(0, Math.min(height - area.height, y))),
  };
}

export const venueAreaKinds: {
  kind: VenueArea["kind"];
  name: string;
  width: number;
  height: number;
}[] = [
  { kind: "stage", name: "Escenario", width: 420, height: 140 },
  { kind: "dance", name: "Pista de baile", width: 380, height: 290 },
  { kind: "snacks", name: "Mesa de bocaditos", width: 280, height: 120 },
  { kind: "bar", name: "Bar", width: 210, height: 120 },
  { kind: "lounge", name: "Zona de descanso", width: 320, height: 180 },
  { kind: "photo", name: "Zona de fotos", width: 240, height: 180 },
  { kind: "entrance", name: "Entrada", width: 180, height: 100 },
];
export function newVenueArea(kind: VenueArea["kind"], id: string): VenueArea {
  const preset =
    venueAreaKinds.find((item) => item.kind === kind) || venueAreaKinds[0];
  return {
    ...preset,
    id,
    x: Math.round((1600 - preset.width) / 2),
    y: Math.round((1000 - preset.height) / 2),
  };
}
