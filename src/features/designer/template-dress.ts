import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { TemplateSource } from "./template-extras";
import { templateText } from "./template-pages";
export function templateDress(
  template: InvitationTemplate,
  source: TemplateSource | undefined,
  text: string,
  i18n: Translator = spanishTranslator,
) {
  const previous = source?.sections
    ?.flatMap((s) => s.canvas?.elements || [])
    .find((e) => e.binding === "dress_code");
  return templateText(
    template,
    "dress",
    text,
    240,
    570,
    40,
    {
      binding: "dress_code",
      eventBound: true,
      dressStyle: "icon-text",
      dressIcon: previous?.dressIcon || "lucide:shirt",
      dressExcludedColors:
        source?.celebration?.dressExcludedColors ||
        source?.creation?.dressExcludedColors ||
        previous?.dressExcludedColors,
    },
    i18n,
  );
}
