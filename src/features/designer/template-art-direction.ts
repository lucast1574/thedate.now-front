import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { FlyerCanvas } from "@/lib/events/flyer";
export function templateArt(template: InvitationTemplate): FlyerCanvas["art"] {
  const layout = template.layout || "";
  if (["botanical", "floral", "landscape"].includes(layout)) return "botanical";
  if (["frame", "arch", "ribbon", "seal"].includes(layout)) return "romance";
  if (["nocturne", "cinematic", "monogram"].includes(layout)) return "gala";
  if (["waves", "minimal"].includes(layout)) return "coastal";
  if (
    ["poster", "celebration", "sunburst", "confetti", "ticket"].includes(layout)
  )
    return "fiesta";
  return "editorial";
}
