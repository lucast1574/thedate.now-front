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
    title: [110, 270, 500, 310, 76],
    kicker: [110, 170, 500, 50, 18],
    body: [150, 650, 420, 140, 24],
    motifs: [
      ["flower", 30, 25, 160, 160, -20],
      ["flower", 530, 735, 150, 150, 160],
      ["leaf", 15, 560, 100, 320],
    ],
    stacked: true,
  },
  editorial: {
    title: [65, 160, 590, 300, 94, "left"],
    kicker: [65, 65, 590, 50, 18, "left"],
    body: [65, 650, 520, 170, 24, "left"],
    motifs: [["sparkle", 510, 520, 120, 120]],
  },
  nocturne: {
    title: [130, 285, 460, 300, 72],
    kicker: [130, 170, 460, 50, 18],
    body: [130, 650, 460, 140, 24],
    motifs: [
      ["frame", 45, 45, 630, 870],
      ["star", 320, 70, 80, 80],
      ["star", 320, 800, 80, 80],
    ],
    stacked: true,
  },
  frame: {
    title: [125, 270, 470, 310, 72],
    kicker: [125, 160, 470, 50, 18],
    body: [130, 650, 460, 140, 24],
    motifs: [
      ["frame", 42, 42, 636, 876],
      ["heart", 330, 805, 60, 60],
    ],
    stacked: true,
  },
  monogram: {
    title: [100, 475, 520, 150, 48],
    kicker: [100, 95, 520, 50, 18],
    body: [125, 690, 470, 140, 24],
    motifs: [],
    monogram: true,
  },
  botanical: {
    title: [145, 290, 430, 290, 64],
    kicker: [145, 190, 430, 50, 18],
    body: [145, 650, 430, 140, 22],
    motifs: [
      ["leaf", 15, 80, 155, 370, -15],
      ["leaf", 550, 540, 155, 370, 165],
    ],
    stacked: true,
  },
  minimal: {
    title: [95, 350, 530, 240, 72],
    kicker: [95, 245, 530, 50, 18],
    body: [135, 675, 450, 140, 23],
    motifs: [["flower", 330, 105, 60, 60]],
  },
  ticket: {
    title: [100, 260, 520, 300, 88, "left"],
    kicker: [100, 155, 520, 50, 18, "left"],
    body: [100, 665, 520, 150, 24, "left"],
    motifs: [["frame", 48, 80, 624, 800]],
    uppercase: true,
  },
  poster: {
    title: [65, 185, 590, 350, 106, "left"],
    kicker: [65, 65, 590, 50, 18, "left"],
    body: [65, 650, 500, 170, 26, "left"],
    motifs: [["star", 485, 735, 160, 160, 15]],
    uppercase: true,
  },
  arch: {
    title: [140, 300, 440, 280, 68],
    kicker: [140, 200, 440, 50, 18],
    body: [140, 650, 440, 140, 23],
    motifs: [["arch", 75, 45, 570, 860]],
    stacked: true,
  },
  celebration: {
    title: [85, 285, 550, 300, 90],
    kicker: [85, 175, 550, 50, 18],
    body: [110, 650, 500, 140, 25],
    motifs: [
      ["star", 50, 45, 160, 160, -12],
      ["sparkle", 500, 40, 130, 130, 15],
      ["sparkle", 60, 755, 120, 120],
      ["star", 500, 760, 150, 150, 20],
    ],
    uppercase: true,
  },
  sunburst: {
    title: [100, 380, 520, 260, 80],
    kicker: [120, 230, 480, 50, 18],
    body: [120, 705, 480, 140, 24],
    motifs: [["sunburst", 170, 35, 380, 380]],
  },
};
