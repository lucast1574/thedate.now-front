export function thumbnailFit(
  width: number,
  height: number,
  contentHeight: number,
) {
  const scale = Math.min(width / 390, height / Math.max(1, contentHeight));
  return { scale, left: (width - 390 * scale) / 2 };
}
