import type { CSSProperties } from "react";
import { flyerFonts, type FlyerCanvas, type FlyerElement } from "./flyer";
export function flyerElementStyle(
  item: FlyerElement,
  canvas: FlyerCanvas,
): CSSProperties {
  return {
    left: `${(item.x / canvas.width) * 100}%`,
    top: `${(item.y / canvas.height) * 100}%`,
    width: `${(item.width / canvas.width) * 100}%`,
    height: `${(item.height / canvas.height) * 100}%`,
    transform: `rotate(${item.rotation}deg)`,
    color: item.color,
    fontFamily: flyerFonts[item.font],
    fontSize: `${(item.fontSize / canvas.width) * 100}cqw`,
    fontWeight: item.bold ? 700 : 400,
    textAlign: item.align,
  };
}
