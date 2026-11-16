import { useTranslator } from "@/lib/i18n/react";
import type { Dispatch, SetStateAction } from "react";
import Icon from "@/components/icon";
import Listbox from "@/components/listbox";
import DressColorRules from "@/features/designer/flyer/dress-color-rules";
import { element } from "@/features/designer/flyer/canvas-model";
import { defaultCelebration } from "@/lib/events/celebration";
import {
  restrictionExamples,
  toggleRestrictionSuggestion,
} from "@/lib/events/restrictions";
import type { Event } from "@/lib/events/types";

export default function EventDressFields({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const i18n = useTranslator();

  const celebration =
    draft.celebration || defaultCelebration(draft.kind === "wedding", i18n);
  const creation = {
    ...draft.creation,
    restrictionText:
      celebration.restrictionText ?? draft.creation?.restrictionText,
    restrictionIcon:
      celebration.restrictionIcon ?? draft.creation?.restrictionIcon,
  };
  const dress = element(
    "text",
    {
      binding: "dress_code",
      dressExcludedColors:
        celebration.dressExcludedColors || creation.dressExcludedColors,
    },
    i18n,
  );
  function patchCreation(patch: Event["creation"]) {
    setDraft((current) => ({
      ...current,
      celebration: { ...celebration, ...patch },
    }));
  }
  return (
    <div className="event-design-details">
      <details className="event-form-options" open>
        <summary>
          <Icon name="lucide:shirt" />
          <span>
            {i18n("Vestimenta y cuidados")}{" "}
            <small>
              {i18n("Dress code, colores reservados e indicaciones.")}
            </small>
          </span>
          <Icon name="chevron" />
        </summary>
        <div>
          <label>
            {i18n("Dress code")}{" "}
            <input
              maxLength={120}
              value={celebration.dressCode}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  celebration: { ...celebration, dressCode: e.target.value },
                })
              }
            />
          </label>
          <label>
            {i18n("Indicaciones de vestimenta")}{" "}
            <textarea
              maxLength={500}
              rows={2}
              value={celebration.dressNote}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  celebration: { ...celebration, dressNote: e.target.value },
                })
              }
            />
          </label>
          <DressColorRules
            item={dress}
            onChange={(patch) =>
              setDraft((current) => ({
                ...current,
                celebration: {
                  ...celebration,
                  dressExcludedColors: patch.dressExcludedColors,
                },
              }))
            }
          />
          <label>
            {i18n("Otras restricciones · opcional")}{" "}
            <textarea
              rows={3}
              maxLength={1000}
              value={creation.restrictionText || ""}
              placeholder={i18n("Por ejemplo: el lugar no admite mascotas…")}
              onChange={(e) =>
                patchCreation({ restrictionText: e.target.value })
              }
            />
          </label>
          <div className="form-rule-suggestions">
            {restrictionExamples(i18n)
              .filter((e) => e.label !== "Solo adultos")
              .map((example) => (
                <button
                  type="button"
                  key={example.label}
                  aria-pressed={(creation.restrictionText || "").includes(
                    example.text,
                  )}
                  disabled={
                    !(creation.restrictionText || "").includes(example.text) &&
                    toggleRestrictionSuggestion(
                      creation.restrictionText || "",
                      example.text,
                    ).length > 1000
                  }
                  onClick={() => {
                    const restrictionText = toggleRestrictionSuggestion(
                      creation.restrictionText || "",
                      example.text,
                    );
                    const selected = restrictionExamples(i18n).filter((item) =>
                      restrictionText.includes(item.text),
                    );
                    patchCreation({
                      restrictionText,
                      restrictionIcon:
                        selected.length === 1
                          ? selected[0].icon
                          : "lucide:shield-alert",
                    });
                  }}
                >
                  <Icon name={example.icon} />
                  {example.label}
                </button>
              ))}
          </div>
          {creation.restrictionText?.trim() && (
            <label>
              {i18n("Icono de la indicación")}{" "}
              <Listbox
                value={creation.restrictionIcon || "lucide:shield-alert"}
                onValueChange={(restrictionIcon) =>
                  patchCreation({ restrictionIcon })
                }
              >
                <option value="lucide:shield-alert">{i18n("Aviso")}</option>
                {restrictionExamples(i18n).map((example) => (
                  <option key={example.icon} value={example.icon}>
                    {example.label}
                  </option>
                ))}
              </Listbox>
            </label>
          )}
          <small>
            {i18n(
              "«Solo adultos» se toma de la sección de invitados. Estas indicaciones se añaden al lienzo y puedes seguir editándolas allí.",
            )}
          </small>
        </div>
      </details>
    </div>
  );
}
