import { normalizeColor, contrastInk } from "@/lib/ui/color";
import type { PublicEvent } from "./types";
export function invitationPaper(event: PublicEvent) {
  const fallback = event.kind === "wedding" ? "#FFF9ED" : "#FFFFFF";
  const background =
    normalizeColor(event.sections?.[0]?.canvas?.background) || fallback;
  const footer =
    normalizeColor(event.sections?.at(-1)?.canvas?.background) || background;
  return { background, footer, ink: contrastInk(footer) };
}
