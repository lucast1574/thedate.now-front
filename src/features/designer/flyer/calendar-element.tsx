import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
import type { FlyerElement } from "@/lib/events/flyer";
import { element } from "./canvas-model";
export default function CalendarElement({
  disabled,
  color,
  onAdd,
}: {
  disabled: boolean;
  color: string;
  onAdd: (item: FlyerElement) => void;
}) {
  const i18n = useTranslator();

  return (
    <button
      disabled={disabled}
      onClick={() =>
        onAdd(
          element(
            "text",
            {
              binding: "calendar_link",
              eventBound: true,
              text: i18n("Añadir al calendario"),
              color,
              fontSize: 30,
              height: 100,
            },
            i18n,
          ),
        )
      }
    >
      <Icon name="calendar" />
      <span>
        {i18n("Añadir al calendario")}{" "}
        <small>{i18n("Fecha del evento, texto y estilo editables")}</small>
      </span>
      <Icon name="plus" />
    </button>
  );
}
