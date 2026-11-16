import {
  type Translator,
  localized,
  spanishTranslator,
} from "@/lib/i18n/translator";
const stages = localized(
  (i18n: Translator): Record<string, { percent: number; label: string }> => ({
    pending: { percent: 10, label: i18n("Tu invitación está en preparación") },
    configured: {
      percent: 35,
      label: i18n("Tu diseño está listo para publicarse"),
    },
    deploying: {
      percent: 70,
      label: i18n("Estamos dando vida a tu invitación"),
    },
    verifying: {
      percent: 90,
      label: i18n("Comprobamos que todo esté listo para tus invitados"),
    },
    ready: { percent: 100, label: i18n("Tu invitación está lista") },
  }),
);
export function preparationProgress(
  phase?: string,
  i18n: Translator = spanishTranslator,
) {
  return (
    stages(i18n)[phase || ""] || {
      percent: 0,
      label: i18n("Estamos preparando tu invitación"),
    }
  );
}
