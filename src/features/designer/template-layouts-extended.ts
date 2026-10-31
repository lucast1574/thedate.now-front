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
    kicker: [80, 640, 560, 50, 18],
    photo: [0, 0, 720, 600],
    title: [80, 710, 560, 130, 64],
    body: [100, 865, 520, 70, 23],
    motifs: [],
  },
  split: {
    kicker: [50, 100, 270, 70, 18, "left"],
    photo: [360, 100, 290, 650],
    title: [50, 260, 270, 370, 58, "left"],
    body: [50, 790, 600, 120, 24, "left"],
    motifs: [["leaf", 70, 660, 90, 90, -30]],
  },
  ribbon: {
    kicker: [100, 90, 520, 60, 18],
    photo: [115, 230, 490, 390],
    title: [100, 680, 520, 140, 58],
    body: [110, 840, 500, 70, 22],
    motifs: [
      ["frame", 85, 190, 550, 470],
      ["ring", 310, 25, 100, 60],
    ],
  },
  typographic: {
    kicker: [55, 50, 610, 50, 18, "left"],
    photo: [380, 570, 280, 300],
    title: [55, 140, 610, 350, 108, "left"],
    body: [55, 620, 280, 220, 28, "left"],
    motifs: [["sparkle", 590, 45, 60, 60]],
    uppercase: true,
  },
  polaroid: {
    kicker: [100, 45, 520, 50, 18],
    photo: [100, 140, 520, 460],
    title: [90, 690, 540, 130, 56],
    body: [100, 845, 520, 70, 23],
    motifs: [
      ["frame", 70, 110, 580, 540],
      ["heart", 320, 610, 80, 60],
    ],
  },
  landscape: {
    kicker: [90, 60, 540, 55, 18],
    photo: [50, 370, 620, 280],
    title: [90, 160, 540, 170, 68],
    body: [110, 730, 500, 150, 27],
    motifs: [["leaf", 590, 790, 70, 100, 30]],
  },
  cinematic: {
    kicker: [70, 70, 580, 50, 18, "left"],
    photo: [0, 0, 720, 960],
    title: [70, 640, 580, 180, 76, "left"],
    body: [70, 850, 580, 80, 24, "left"],
    motifs: [],
  },
  mosaic: {
    kicker: [80, 40, 560, 45, 17, "left"],
    photo: [70, 340, 350, 400],
    title: [80, 110, 560, 180, 72, "left"],
    body: [460, 590, 200, 250, 25, "left"],
    motifs: [
      ["flower", 490, 370, 150, 150],
      ["frame", 60, 770, 360, 100],
    ],
  },
  seal: {
    kicker: [140, 200, 440, 45, 18],
    photo: [170, 600, 380, 220],
    title: [130, 300, 460, 220, 64],
    body: [110, 850, 500, 70, 23],
    motifs: [
      ["arch", 40, 40, 640, 860],
      ["ring", 300, 80, 120, 80],
    ],
    stacked: true,
  },
  waves: {
    kicker: [100, 130, 520, 45, 17],
    photo: [60, 450, 600, 300],
    title: [100, 210, 520, 170, 67],
    body: [110, 810, 500, 100, 24],
    motifs: [["arch", 60, 30, 600, 360]],
  },
  confetti: {
    kicker: [100, 170, 520, 45, 18],
    photo: [130, 550, 460, 280],
    title: [80, 280, 560, 210, 80],
    body: [100, 865, 520, 65, 22],
    motifs: [
      ["star", 40, 45, 120, 120, -15],
      ["sparkle", 550, 50, 110, 110, 20],
      ["sparkle", 35, 650, 70, 70],
      ["star", 620, 770, 65, 65, 25],
    ],
  },
  grid: {
    kicker: [430, 75, 230, 50, 17, "left"],
    photo: [60, 100, 340, 400],
    title: [430, 170, 230, 330, 48, "left"],
    body: [80, 650, 560, 180, 32, "left"],
    motifs: [["frame", 30, 40, 660, 880]],
  },
};
