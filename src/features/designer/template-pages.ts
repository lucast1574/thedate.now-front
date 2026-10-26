import { element } from "./flyer/canvas-model";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { FlyerElement } from "@/lib/events/flyer";
import type { DesignSection } from "@/lib/events/types";
export function templatePage(
  template: InvitationTemplate,
  heading: string,
  height: number,
  elements: FlyerElement[],
): DesignSection {
  const id = crypto.randomUUID();
  return {
    id,
    heading,
    body: "",
    icon: "none",
    canvas: {
      width: 720,
      height,
      background: template.background,
      elements: elements.map((item) => ({
        ...item,
        id: `${id.slice(0, 8)}-${item.id}`,
      })),
    },
  };
}
export function templateText(
  template: InvitationTemplate,
  id: string,
  text: string,
  y: number,
  height = 100,
  size = 36,
  patch: Partial<FlyerElement> = {},
) {
  const longest = Math.max(1, ...text.split(/\s/).map((s) => s.length));
  return element("text", {
    id,
    text,
    x: 60,
    y,
    width: 600,
    height,
    font: template.font,
    color: template.accent,
    fontSize: Math.max(
      14,
      Math.min(
        size,
        Math.floor(600 / (longest * 0.65)),
        Math.floor(
          Math.sqrt((600 * height) / (Math.max(1, text.length) * 0.65)),
        ),
      ),
    ),
    ...patch,
  });
}
export function templateIcon(
  template: InvitationTemplate,
  icon: string,
  y: number,
) {
  return element("icon", {
    id: icon.replace(":", "-"),
    icon,
    x: 310,
    y,
    width: 100,
    height: 100,
    color: template.accent,
  });
}
