import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { extendedLayouts } from "./template-layouts-extended";
export type Box = [
  number,
  number,
  number,
  number,
  number,
  ("left" | "center" | "right")?,
];
type Motif = [string, number, number, number, number, number?];
export type Layout = {
  photo?: [number, number, number, number];
  photoTreatment?: "none" | "cinema" | "arch" | "soft";
  titleFont?: "serif" | "sans" | "script";
  title: Box;
  kicker: Box;
  body: Box;
  motifs: Motif[];
  stacked?: boolean;
  uppercase?: boolean;
  monogram?: boolean;
};
export const templateLayouts: Record<
  NonNullable<InvitationTemplate["layout"]>,
  Layout
> = {
  ...extendedLayouts,
  floral: {
    title: [72, 290, 576, 290, 110],
    titleFont: "script",
    kicker: [110, 210, 500, 50, 22],
    body: [120, 650, 480, 140, 28],
    motifs: [
      ["flower", 30, 25, 160, 160, -20],
      ["flower", 530, 735, 150, 150, 160],
      ["leaf", 15, 560, 100, 320],
    ],
    stacked: false,
  },
  editorial: {
    title: [48, 200, 624, 330, 110, "left"],
    kicker: [48, 82, 560, 50, 22, "left"],
    body: [48, 665, 500, 170, 28, "left"],
    motifs: [["sparkle", 510, 520, 120, 120]],
  },
  nocturne: {
    title: [100, 290, 520, 310, 96],
    kicker: [110, 195, 500, 50, 22],
    body: [120, 690, 480, 140, 28],
    motifs: [
      ["frame", 45, 45, 630, 870],
      ["star", 320, 70, 80, 80],
      ["star", 320, 800, 80, 80],
    ],
    stacked: false,
  },
  frame: {
    title: [95, 300, 530, 280, 102],
    titleFont: "script",
    kicker: [125, 225, 470, 50, 22],
    body: [115, 655, 490, 145, 28],
    motifs: [
      ["frame", 42, 42, 636, 876],
      ["heart", 330, 805, 60, 60],
    ],
    stacked: false,
  },
  monogram: {
    title: [80, 510, 560, 150, 64],
    kicker: [100, 155, 520, 50, 22],
    body: [100, 720, 520, 130, 28],
    motifs: [],
    monogram: true,
  },
  botanical: {
    title: [100, 305, 520, 285, 92],
    kicker: [100, 215, 520, 50, 22],
    body: [115, 675, 490, 140, 28],
    motifs: [
      ["leaf", 15, 80, 155, 370, -15],
      ["leaf", 550, 540, 155, 370, 165],
    ],
    stacked: false,
  },
  minimal: {
    title: [64, 290, 592, 290, 98],
    kicker: [64, 205, 592, 50, 22],
    body: [110, 650, 500, 140, 28],
    motifs: [["flower", 330, 105, 60, 60]],
  },
  ticket: {
    title: [64, 235, 592, 340, 104, "left"],
    kicker: [64, 130, 592, 50, 22, "left"],
    body: [64, 650, 500, 160, 28, "left"],
    motifs: [["frame", 48, 80, 624, 800]],
    uppercase: true,
  },
  poster: {
    title: [48, 210, 624, 360, 118, "left"],
    kicker: [48, 105, 624, 50, 22, "left"],
    body: [220, 660, 452, 150, 28, "right"],
    motifs: [["star", 485, 735, 160, 160, 15]],
    uppercase: true,
  },
  arch: {
    title: [110, 320, 500, 275, 90],
    kicker: [120, 235, 480, 50, 22],
    body: [120, 670, 480, 140, 28],
    motifs: [["arch", 75, 45, 570, 860]],
    stacked: false,
  },
  celebration: {
    title: [64, 255, 592, 340, 108],
    kicker: [64, 165, 592, 50, 22],
    body: [120, 650, 480, 140, 28],
    motifs: [
      ["star", 50, 45, 160, 160, -12],
      ["sparkle", 500, 40, 130, 130, 15],
      ["sparkle", 60, 755, 120, 120],
      ["star", 500, 760, 150, 150, 20],
    ],
    uppercase: true,
  },
  sunburst: {
    title: [64, 340, 592, 300, 104],
    kicker: [100, 245, 520, 50, 22],
    body: [110, 700, 500, 140, 28],
    motifs: [["sunburst", 170, 35, 380, 380]],
  },
};
