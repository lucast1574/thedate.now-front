import type { Layout } from "./template-layouts";
type Name =
  | "gallery"
  | "split"
  | "ribbon"
  | "typographic"
  | "polaroid"
  | "landscape"
  | "cinematic"
  | "mosaic"
  | "seal"
  | "waves"
  | "confetti"
  | "grid";
export const extendedLayouts: Record<Name, Layout> = {
  gallery: {
    kicker: [48, 48, 624, 44, 22, "left"],
    photo: [0, 0, 720, 770],
    photoTreatment: "cinema",
    title: [48, 565, 624, 170, 92, "left"],
    body: [48, 815, 624, 95, 26, "left"],
    motifs: [],
  },
  split: {
    kicker: [48, 95, 280, 70, 22, "left"],
    photo: [370, 40, 310, 720],
    title: [48, 240, 290, 400, 68, "left"],
    body: [48, 805, 624, 110, 28, "left"],
    motifs: [["leaf", 70, 660, 90, 90, -30]],
  },
  ribbon: {
    kicker: [100, 195, 520, 50, 22],
    photo: [80, 285, 560, 360],
    title: [64, 690, 592, 125, 88],
    titleFont: "script",
    body: [100, 850, 520, 75, 26],
    motifs: [
      ["frame", 85, 190, 550, 470],
      ["ring", 310, 25, 100, 60],
    ],
  },
  typographic: {
    kicker: [48, 75, 624, 50, 22, "left"],
    photo: [370, 565, 302, 340],
    title: [48, 175, 624, 345, 104, "left"],
    body: [48, 620, 270, 245, 28, "left"],
    motifs: [["sparkle", 590, 45, 60, 60]],
    uppercase: true,
  },
  polaroid: {
    kicker: [64, 620, 592, 45, 22],
    photo: [32, 32, 656, 665],
    photoTreatment: "cinema",
    title: [48, 735, 624, 110, 70],
    body: [64, 855, 592, 65, 24],
    motifs: [],
  },
  landscape: {
    kicker: [56, 52, 608, 50, 22],
    photo: [0, 0, 720, 800],
    photoTreatment: "cinema",
    title: [56, 130, 608, 220, 94],
    body: [56, 830, 608, 90, 26],
    motifs: [],
  },
  cinematic: {
    kicker: [48, 48, 624, 50, 22, "left"],
    photo: [0, 0, 720, 960],
    photoTreatment: "cinema",
    title: [48, 610, 624, 200, 104, "left"],
    body: [48, 835, 580, 85, 26, "left"],
    motifs: [],
  },
  mosaic: {
    kicker: [48, 65, 624, 50, 22, "left"],
    photo: [48, 365, 385, 530],
    title: [48, 155, 624, 165, 88, "left"],
    body: [475, 555, 197, 290, 26, "left"],
    motifs: [
      ["flower", 490, 370, 150, 150],
      ["frame", 60, 770, 360, 100],
    ],
  },
  seal: {
    kicker: [120, 225, 480, 50, 22],
    photo: [150, 600, 420, 225],
    title: [100, 325, 520, 205, 94],
    titleFont: "script",
    body: [100, 855, 520, 70, 26],
    motifs: [
      ["arch", 40, 40, 640, 860],
      ["ring", 300, 80, 120, 80],
    ],
    stacked: false,
  },
  waves: {
    kicker: [64, 145, 592, 50, 22],
    photo: [32, 445, 656, 325],
    title: [64, 235, 592, 160, 90],
    body: [90, 820, 540, 95, 28],
    motifs: [["arch", 60, 30, 600, 360]],
  },
  confetti: {
    kicker: [64, 150, 592, 50, 22],
    photo: [100, 545, 520, 290],
    title: [64, 250, 592, 235, 100],
    body: [80, 865, 560, 60, 26],
    motifs: [
      ["star", 40, 45, 120, 120, -15],
      ["sparkle", 550, 50, 110, 110, 20],
      ["sparkle", 35, 650, 70, 70],
      ["star", 620, 770, 65, 65, 25],
    ],
  },
  grid: {
    kicker: [435, 80, 237, 65, 22, "left"],
    photo: [48, 80, 335, 525],
    title: [435, 215, 237, 380, 58, "left"],
    body: [48, 705, 624, 165, 34, "left"],
    motifs: [["frame", 30, 40, 660, 880]],
  },
};
