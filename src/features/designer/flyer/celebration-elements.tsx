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
        disabled={disabled || !details.adultsOnly}
        onClick={() =>
          onAdd(
            element("text", {
              binding: "adults_notice",
              text: details.adultsMessage,
              font: draft.kind === "wedding" ? "serif" : "sans",
              fontSize: 28,
              color: draft.accentColor,
              height: 220,
            }),
          )
        }
      >
        <Icon name="lucide:shield-check" />
        <span>
          Solo adultos
          <small>
            {details.adultsOnly
              ? "Coloca tu aviso en la invitación"
              : "Actívalo en Detalles"}
          </small>
        </span>
        <Icon name="plus" />
      </button>
    </div>
  );
}
