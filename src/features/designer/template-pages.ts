import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { collectionRhythm } from "./collection-rhythm";
import { editableOrnaments } from "./editable-ornaments";
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
  i18n: Translator = spanishTranslator,
): DesignSection {
  const id = crypto.randomUUID();
  return {
    id,
    heading,
    body: "",
    icon: "none",
    canvas: editableOrnaments(
      adaptTemplateCanvas(
        collectionRhythm(
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
                        photoTreatment: item.photoTreatment || "none",
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
            i18n,
          ),
          template,
          heading,
          i18n,
        ),
      ),
      undefined,
      i18n,
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
  i18n: Translator = spanishTranslator,
) {
  return element(
    "text",
    {
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
    },
    i18n,
  );
}
export function templateIcon(
  template: InvitationTemplate,
  icon: string,
  y: number,
  i18n: Translator = spanishTranslator,
) {
  return element(
    "icon",
    {
      id: icon.replace(":", "-"),
      icon,
      x: 310,
      y,
      width: 100,
      height: 100,
      color: template.accent,
    },
    i18n,
  );
}
