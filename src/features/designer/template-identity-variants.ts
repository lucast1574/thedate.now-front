import type { TemplateIdentity } from "./template-identity";
import type { Layout } from "./template-layouts";
export const identityVariants: Record<string, Partial<TemplateIdentity>> = {
  "wedding-flyer-vine": {
    story: "portrait",
    lead: "La vida que crece con nosotros",
    flow: "story",
    align: "left",
    inset: 95,
    opening: "Una historia que crece, hoja a hoja, contigo.",
  },
  "wedding-flyer-paris": {
    story: "letter",
    lead: "Una historia para guardar",
    flow: "story",
    align: "center",
    inset: 125,
    seal: "heart",
    opening: "Una carta, una ciudad y una historia que es nuestra.",
  },
  "wedding-flyer-ruby": {
    story: "portrait",
    lead: "Un sí que lo dice todo",
    flow: "date",
    inset: 110,
    opening: "Hay promesas que merecen un lugar especial.",
  },
  "general-flyer-birthday": {
    story: "portrait",
    eventLead: "Que este deseo nos encuentre juntos",
    flow: "story",
    align: "center",
    inset: 100,
    seal: "star",
    opening: "Pide un deseo: el próximo recuerdo empieza aquí.",
  },
  "general-flyer-launch": {
    story: "panorama",
    eventLead: "Algo nuevo está por comenzar",
    flow: "date",
    inset: 65,
    seal: "sparkle",
    opening: "El gran estreno merece una entrada especial.",
  },
  "general-flyer-dinner": {
    story: "letter",
    eventLead: "El mejor plan está en la mesa",
    flow: "place",
    align: "left",
    inset: 110,
    seal: "heart",
    opening: "Pasa, tu sitio en la mesa ya está preparado.",
  },
};
export const coverVariants: Record<string, Partial<Layout>> = {
  "wedding-flyer-vine": {
    kicker: [95, 120, 530, 60, 18, "left"],
    title: [95, 250, 440, 350, 74, "left"],
    body: [95, 690, 450, 150, 26, "left"],
    stacked: false,
  },
  "wedding-flyer-paris": {
    kicker: [125, 130, 470, 60, 18],
    title: [125, 270, 470, 330, 78],
    body: [125, 700, 470, 140, 25],
    stacked: true,
  },
  "wedding-flyer-ruby": {
    kicker: [110, 110, 500, 60, 18],
    title: [110, 240, 500, 330, 88],
    body: [110, 690, 500, 150, 26],
    stacked: false,
  },
  "general-flyer-birthday": {
    kicker: [100, 140, 520, 60, 18],
    title: [100, 270, 520, 330, 88],
    body: [100, 700, 520, 140, 26],
    uppercase: false,
  },
  "general-flyer-launch": {
    kicker: [65, 65, 590, 60, 18, "left"],
    title: [65, 170, 590, 260, 84, "left"],
    photo: [400, 490, 250, 350],
    body: [65, 630, 280, 230, 26, "left"],
  },
  "general-flyer-dinner": {
    kicker: [110, 150, 500, 60, 18, "left"],
    title: [110, 300, 500, 260, 76, "left"],
    body: [110, 690, 460, 150, 26, "left"],
  },
};
