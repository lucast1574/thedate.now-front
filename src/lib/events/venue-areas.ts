export type VenueArea = {
  id: string;
  name: string;
  kind: "snacks" | "bar" | "stage" | "dance";
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
    id: "area-stage",
    name: "Escenario",
    kind: "stage",
    x: 590,
    y: 140,
    width: 420,
    height: 110,
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
