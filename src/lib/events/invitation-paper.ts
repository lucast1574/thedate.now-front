import { normalizeColor } from "@/lib/ui/color";
import type { PublicEvent } from "./types";
export function invitationPaper(event: PublicEvent) {
  const fallback = event.kind === "wedding" ? "#FFF9ED" : "#FFFFFF";
  const background =
    normalizeColor(event.sections?.[0]?.canvas?.background) || fallback;
  const footer =
    normalizeColor(event.sections?.at(-1)?.canvas?.background) || background;
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(footer.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance =
    channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return { background, footer, ink: luminance > 0.179 ? "#242424" : "#FFFFFF" };
}
