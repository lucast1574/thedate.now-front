import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import type { ImageBackground } from "./background";
export type Opening = {
  backgroundImage?: ImageBackground;
  title?: string;
  font?: "" | "serif" | "sans" | "script";
  sealIcon?: string;
  paletteMode?: "design" | "custom";
  enabled: boolean;
  style: "classic" | "arch" | "ticket" | "curtain" | "bloom" | "orbit";
  color: string;
  ink: string;
  message: string;
  buttonLabel: string;
};
export type Celebration = {
  partnerOne?: string;
  partnerTwo?: string;
  mapLatitude?: number;
  mapLongitude?: number;
  restrictionText?: string;
  restrictionIcon?: string;
  dressExcludedColors?: { name: string; color: string }[];
  adultsOnly: boolean;
  adultsMessage: string;
  whatsappNotice: boolean;
  dressCode: string;
  dressNote: string;
  giftsEnabled?: boolean;
};
export const defaultCelebration = (
  wedding: boolean,
  i18n: Translator = spanishTranslator,
): Celebration => ({
  giftsEnabled: true,
  adultsOnly: false,
  adultsMessage: i18n(
    "Celebraremos este día solo entre adultos. Gracias por acompañarnos y por tu comprensión.",
  ),
  whatsappNotice: false,
  dressCode: wedding ? i18n("Elegante") : i18n("A tu estilo"),
  dressNote: i18n("Elige un look cómodo para celebrar con nosotros."),
});
export const defaultOpening = (
  wedding: boolean,
  color?: string,
  ink?: string,
  i18n: Translator = spanishTranslator,
): Opening => ({
  enabled: true,
  paletteMode: "design",
  style: wedding ? "classic" : "ticket",
  color: color || (wedding ? "#F4EBDF" : "#EDE6FA"),
  ink: ink || (wedding ? "#766044" : "#463466"),
  message: wedding
    ? i18n("Nuestra historia tiene un nuevo capítulo. Ábrelo con nosotros.")
    : i18n("Tenemos algo especial para celebrar contigo."),
  buttonLabel: i18n("Abrir invitación"),
});
