import type { FlyerCanvas } from "@/lib/events/flyer";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
export function stageTemplate(
  canvas: FlyerCanvas,
  template: InvitationTemplate,
  cover = false,
): FlyerCanvas {
  const height = cover ? 1280 : Math.max(760, Math.round(canvas.height * 1.15));
  const scale = height / canvas.height;
  const staged: FlyerCanvas = {
    ...canvas,
    height,
    elements: canvas.elements.map((e) => {
      const title = /title|intro|thanks|save-date/.test(e.id),
        small = /kicker|initials/.test(e.id);
      const fontSize =
        e.type === "text"
          ? small
            ? Math.max(e.fontSize, 24)
            : Math.max(e.fontSize * (title ? 1.12 : 1.08), title ? 54 : 30)
          : e.fontSize;
      return {
        ...e,
        y: Math.round(e.y * scale),
        height: Math.round(e.height * scale),
        fontSize: Math.round(fontSize),
      };
    }),
  };
  if (cover) {
    staged.elements.push({
      id: "discover-arrow",
      type: "icon",
      icon: "lucide:arrow-down",
      x: 345,
      y: height - 42,
      width: 30,
      height: 30,
      fontSize: 24,
      font: "sans",
      color: template.layout === "cinematic" ? "#ffffff" : template.accent,
      align: "center",
      rotation: 0,
      bold: false,
    });
  }
  return staged;
}
