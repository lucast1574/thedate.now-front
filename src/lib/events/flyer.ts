import type { ImageBackground } from "./background";
export type DesignMode = "sections" | "flyer";
export type FlyerElement = {
  eventBound?: boolean;
  nameFormat?: "names" | "initials" | "stacked" | "uppercase";
  actionHint?: boolean;
  hintText?: string;
  hintIcon?: string;
  hintStyle?: "text" | "icon" | "icon-text";
  mapLatitude?: number;
  mapLongitude?: number;
  mapZoom?: number;
  mapStyle?: "natural" | "warm" | "ink";
  mapRadius?: number;
  mapSoftness?: number;
  dressExcludedColors?: { name: string; color: string }[];
  restrictionStyle?: "icon" | "text" | "icon-text";
  restrictionIcon?: string;
  dressStyle?:
    | "text"
    | "icon"
    | "image"
    | "icon-text"
    | "image-text"
    | "icon-image"
    | "all";
  dressIcon?: string;
  dressPhotoKey?: string;
  binding?:
    | "guest_name"
    | "couple_names"
    | "event_title"
    | "event_date"
    | "map"
    | "location"
    | "dress_code"
    | "adults_notice"
    | "gift_link"
    | "restrictions";
  locationStyle?:
    | "icon"
    | "label"
    | "address"
    | "icon-label"
    | "icon-address"
    | "label-address"
    | "all";
  address?: string;
  link?: string;
  id: string;
  type: "text" | "image" | "icon";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  text?: string;
  photoKey?: string;
  icon?: string;
  color: string;
  font: "serif" | "sans" | "mono" | "script";
  fontSize: number;
  bold: boolean;
  align: "left" | "center" | "right";
};
export type FlyerCanvas = {
  backgroundImage?: ImageBackground;
  backgroundOverride?: boolean;
  width: number;
  height: number;
  background: string;
  elements: FlyerElement[];
};
export const flyerFonts = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "Arial, Helvetica, sans-serif",
  mono: "'Courier New', monospace",
  script: "'Brush Script MT', 'Segoe Script', cursive",
};
