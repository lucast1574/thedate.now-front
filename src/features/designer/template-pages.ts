import { interiorLayout } from "./template-interior-layout";
import { stageTemplate } from "./template-stage";
import { adaptTemplateCanvas } from "./adapt-template-content";
import { templateArt } from "./template-art-direction";
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
    canvas: adaptTemplateCanvas(
      interiorLayout(
        stageTemplate(
          {
            art: templateArt(template),
            font: template.font,
            width: 720,
            height,
            background: template.background,
            elements: elements.map((item) => ({
              ...item,
              ...(item.type === "image"
                ? {
                    photoFit: item.photoFit || ("cover" as const),
                    photoTreatment:
                      item.photoTreatment ||
                      (templateArt(template) === "botanical"
                        ? ("soft" as const)
                        : ("fade" as const)),
                  }
                : {}),
              ...([
                "editorial",
                "split",
                "typographic",
                "grid",
                "cinematic",
              ].includes(template.layout || "") && item.type === "text"
                ? { align: "left" as const }
                : {}),
              id: `${id.slice(0, 8)}-${item.id}`,
            })),
          },
          template,
        ),
        template,
        heading,
      ),
    ),
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
  return element("text", {
    id,
    text,
    x: 60,
    y,
    width: 600,
    height,
    font: template.font,
    color: template.accent,
    fontSize: size,
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
