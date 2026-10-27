import type { ImageBackground } from "./background";
export type Opening = {
  backgroundImage?: ImageBackground;
  title?: string;
  font?: "" | "serif" | "sans" | "script";
  sealIcon?: string;
  enabled: boolean;
  style: "classic" | "arch" | "ticket";
  color: string;
  ink: string;
  message: string;
  buttonLabel: string;
};
export type Celebration = {
  adultsOnly: boolean;
  adultsMessage: string;
  whatsappNotice: boolean;
  dressCode: string;
  dressNote: string;
};
export const defaultCelebration = (wedding: boolean): Celebration => ({
  adultsOnly: false,
  adultsMessage:
    "Celebraremos este día solo entre adultos. Gracias por acompañarnos y por tu comprensión.",
  whatsappNotice: false,
  dressCode: wedding ? "Elegante" : "A tu estilo",
  dressNote: "Elige un look cómodo para celebrar con nosotros.",
});
export const defaultOpening = (
  wedding: boolean,
  color?: string,
  ink?: string,
): Opening => ({
  enabled: true,
  style: wedding ? "classic" : "ticket",
  color: color || (wedding ? "#F4EBDF" : "#EDE6FA"),
  ink: ink || (wedding ? "#766044" : "#463466"),
  message: wedding
    ? "Nuestra historia tiene un nuevo capítulo. Ábrelo con nosotros."
    : "Tenemos algo especial para celebrar contigo.",
  buttonLabel: "Abrir invitación",
});
