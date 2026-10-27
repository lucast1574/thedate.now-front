import type { DesignSection } from "./types";
export type ImageBackground = {
  photoKey: string;
  fit: "cover" | "contain";
  position: "center" | "top" | "bottom";
  opacity: number;
};
export type BackgroundSlice = {
  image: ImageBackground;
  offset: number;
  total: number;
  height: number;
};
export function sectionBackground(
  sections: DesignSection[],
  index: number,
  common?: ImageBackground | null,
): BackgroundSlice | undefined {
  const canvas = sections[index]?.canvas;
  if (!canvas || canvas.backgroundOverride) return;
  const height = canvas.height / canvas.width;
  if (canvas.backgroundImage)
    return { image: canvas.backgroundImage, offset: 0, total: height, height };
  if (!common) return;
  const heights = sections.map((s) =>
    s.canvas ? s.canvas.height / s.canvas.width : 0,
  );
  return {
    image: common,
    offset: heights.slice(0, index).reduce((a, b) => a + b, 0),
    total: heights.reduce((a, b) => a + b, 0),
    height,
  };
}
export const newImageBackground = (photoKey: string): ImageBackground => ({
  photoKey,
  fit: "cover",
  position: "center",
  opacity: 1,
});
