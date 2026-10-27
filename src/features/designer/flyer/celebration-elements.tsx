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
    </div>
  );
}
