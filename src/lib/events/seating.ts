export type Gender = "man" | "woman" | "unspecified";
export type Person = { name: string; lastName: string; gender: Gender };
export type Attendee = Person & {
  id: string;
  guestId: string;
  family: string;
  response: string;
  slot: number;
  registered: boolean;
};
export type SeatingTable = {
  id: string;
  name: string;
  shape: "round" | "rectangle";
  capacity: number;
  x: number;
  y: number;
  rotation: number;
};
export type SeatingPlan = {
  version: number;
  width: number;
  height: number;
  tables: SeatingTable[];
  assignments: Record<string, string>;
};
export const emptyPlan = (): SeatingPlan => ({
  version: 0,
  width: 1600,
  height: 1000,
  tables: [],
  assignments: {},
});
