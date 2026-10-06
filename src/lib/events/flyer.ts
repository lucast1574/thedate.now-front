export type DesignMode = "sections" | "flyer";
export type FlyerElement = {
  binding?: "guest_name";
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
