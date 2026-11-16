import { useTranslator } from "@/lib/i18n/react";
import CalendarElement from "./calendar-element";
import { restrictionDefaults } from "@/lib/events/restrictions";
import Icon from "@/components/icon";
import { defaultCelebration } from "@/lib/events/celebration";
import type { DesignEvent } from "@/lib/events/types";
import type { FlyerElement } from "@/lib/events/flyer";
import { element } from "./canvas-model";
export default function CelebrationElements({
  draft,
  disabled,
  onAdd,
}: {
  draft: DesignEvent;
  disabled: boolean;
  onAdd: (item: FlyerElement) => void;
}) {
  const i18n = useTranslator();

  const details =
    draft.celebration || defaultCelebration(draft.kind === "wedding", i18n);
  return (
    <div className="canvas-special-tools">
      <CalendarElement
        disabled={disabled}
        color={draft.accentColor}
        onAdd={onAdd}
      />
      <button
        disabled={disabled}
        onClick={() =>
          onAdd(
            element(
              "text",
              {
                binding: "dress_code",
                eventBound: true,
                dressStyle: "icon-text",
                dressIcon: "lucide:shirt",
                dressExcludedColors:
                  details.dressExcludedColors ||
                  draft.sections
                    ?.flatMap((section) => section.canvas?.elements || [])
                    .find((item) => item.binding === "dress_code")
                    ?.dressExcludedColors,
                text: i18n("{v0}\n{v1}", {
                  v0: details.dressCode,
                  v1: details.dressNote,
                }),
                font: draft.kind === "wedding" ? "serif" : "sans",
                fontSize: 30,
                color: draft.accentColor,
                height: 200,
              },
              i18n,
            ),
          )
        }
      >
        <Icon name="lucide:shirt" />
        <span>
          {i18n("Dress code")}
          <small>{i18n("Vestimenta e indicaciones editables")}</small>
        </span>
        <Icon name="plus" />
      </button>
      <button
        disabled={disabled}
        onClick={() =>
          onAdd(
            element(
              "text",
              {
                binding: "gift_link",
                link: "/regalos",
                text: i18n("Lista de regalos"),
                font: draft.kind === "wedding" ? "serif" : "sans",
                fontSize: 30,
                color: draft.accentColor,
                height: 120,
              },
              i18n,
            ),
          )
        }
      >
        <Icon name="lucide:gift" />
        <span>
          {i18n("Lista de regalos")}
          <small>{i18n("Conectada automáticamente a tus regalos")}</small>
        </span>
        <Icon name="plus" />
      </button>
      <button
        disabled={disabled}
        onClick={() =>
          onAdd(
            element(
              "text",
              {
                binding: "restrictions",
                restrictionStyle: "icon-text",
                ...restrictionDefaults(draft, undefined, i18n),
                font: draft.kind === "wedding" ? "serif" : "sans",
                fontSize: 28,
                color: draft.accentColor,
                height: 220,
              },
              i18n,
            ),
          )
        }
      >
        <Icon name="lucide:shield-alert" />
        <span>
          {i18n("Restricciones")}
          <small>{i18n("Niños, mascotas y otras indicaciones")}</small>
        </span>
        <Icon name="plus" />
      </button>
    </div>
  );
}
