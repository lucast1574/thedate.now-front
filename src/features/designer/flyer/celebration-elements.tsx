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
  const details =
    draft.celebration || defaultCelebration(draft.kind === "wedding");
  return (
    <div className="canvas-special-tools">
      <button
        disabled={disabled}
        onClick={() =>
          onAdd(
            element("text", {
              binding: "dress_code",
              dressStyle: "icon-text",
              dressIcon: "lucide:shirt",
              dressExcludedColors:
                details.dressExcludedColors ||
                draft.sections
                  ?.flatMap((section) => section.canvas?.elements || [])
                  .find((item) => item.binding === "dress_code")
                  ?.dressExcludedColors,
              text: `${details.dressCode}\n${details.dressNote}`,
              font: draft.kind === "wedding" ? "serif" : "sans",
              fontSize: 30,
              color: draft.accentColor,
              height: 200,
            }),
          )
        }
      >
        <Icon name="lucide:shirt" />
        <span>
          Dress code<small>Vestimenta e indicaciones editables</small>
        </span>
        <Icon name="plus" />
      </button>
      <button
        disabled={disabled}
        onClick={() =>
          onAdd(
            element("text", {
              binding: "gift_link",
              link: "/regalos",
              text: "Lista de regalos",
              font: draft.kind === "wedding" ? "serif" : "sans",
              fontSize: 30,
              color: draft.accentColor,
              height: 120,
            }),
          )
        }
      >
        <Icon name="lucide:gift" />
        <span>
          Lista de regalos<small>Tu lista o un enlace de otra tienda</small>
        </span>
        <Icon name="plus" />
      </button>
      <button
        disabled={disabled}
        onClick={() =>
          onAdd(
            element("text", {
              binding: "restrictions",
              restrictionStyle: "icon-text",
              restrictionIcon: "lucide:shield-alert",
              text: "Ten en cuenta estas indicaciones antes de asistir.",
              font: draft.kind === "wedding" ? "serif" : "sans",
              fontSize: 28,
              color: draft.accentColor,
              height: 220,
            }),
          )
        }
      >
        <Icon name="lucide:shield-alert" />
        <span>
          Restricciones<small>Niños, mascotas y otras indicaciones</small>
        </span>
        <Icon name="plus" />
      </button>
    </div>
  );
}
