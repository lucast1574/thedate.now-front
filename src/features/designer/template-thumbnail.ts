import { element } from "./flyer/canvas-model";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
export function templateThumbnail(template: InvitationTemplate) {
  return {
    width: 720,
    height: 960,
    background: template.background,
    elements: [
      element("icon", {
        id: "symbol",
        icon: template.kind === "wedding" ? "flower" : "star",
        x: 310,
        y: 100,
        color: template.accent,
      }),
      element("text", {
        id: "title",
        text: template.kind === "wedding" ? "Ana\n& Luis" : "Celebremos",
        x: 70,
        y: 310,
        width: 580,
        height: 260,
        fontSize: 74,
        font: template.font,
        color: template.accent,
      }),
      element("text", {
        id: "caption",
        text:
          template.mode === "flyer"
            ? "TU INVITACIÓN · TU ESTILO"
            : "HISTORIA · DETALLES · RECUERDOS",
        x: 80,
        y: 650,
        fontSize: 20,
        color: template.accent,
        font: "sans",
      }),
    ],
  };
}
