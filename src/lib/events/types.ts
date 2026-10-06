import type { Gender, Person } from "./seating";
import type { DesignMode, FlyerCanvas } from "./flyer";
export type Kind = "wedding" | "general";
export type DesignSection = {
  canvas?: FlyerCanvas;
  id: string;
  icon: string;
  heading: string;
  body: string;
  photoKey?: string;
};
export type DesignEvent = {
  templateId?: string;
  designMode?: DesignMode;
  id: string;
  kind: Kind;
  title: string;
  description: string;
  template: string;
  accentColor: string;
  sections?: DesignSection[];
  photoKeys: string[];
  isDemo?: boolean;
};
export type Event = DesignEvent & {
  ownerId?: string;
  slug: string;
  startAt: string;
  timeZone: string;
  organizer: string;
  location: string;
  isVirtual: boolean;
  mapUrl: string;
  virtualUrl: string;
  capacity: number;
  capacityUnlimited?: boolean;
  maybeHoldHours: number;
  paymentStatus: string;
  publishedAt: string | null;
  updatedAt?: string;
};
export type PublicEvent = Pick<
  Event,
  | "id"
  | "kind"
  | "slug"
  | "title"
  | "description"
  | "startAt"
  | "timeZone"
  | "organizer"
  | "location"
  | "isVirtual"
  | "mapUrl"
  | "virtualUrl"
  | "accentColor"
  | "template"
  | "templateId"
  | "designMode"
  | "sections"
  | "photoKeys"
>;
export type Guest = {
  lastName?: string;
  family?: string;
  gender?: Gender;
  companions?: Person[];
  attendingSeats?: number;
  partyRegistered?: boolean;
  id: string;
  name: string;
  phone: string;
  seats: number;
  response: string;
  maybeReason?: string;
  maybeExpiresAt?: string;
  invitationUrl: string;
  sentAt?: string;
};
export type User = {
  portals?: Kind[];
  creatorPortals?: Kind[];
  id: string;
  name: string;
  email: string;
  role: "admin" | "planner" | "organizer" | "couple";
};
export type AccountFields = { name: string; email: string; password: string };
export type GuestFields = Pick<
  Guest,
  "name" | "phone" | "seats" | "lastName" | "family" | "gender" | "companions"
>;
export type AuthMode = "login" | "register";
