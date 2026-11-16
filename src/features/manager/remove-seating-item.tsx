import { useTranslator } from "@/lib/i18n/react";
import { useInlineConfirmation } from "@/components/use-inline-confirmation";
import Icon from "@/components/icon";
export default function RemoveSeatingItem({
  name,
  description,
  onRemove,
}: {
  name: string;
  description: string;
  onRemove: () => void;
}) {
  const i18n = useTranslator();

  const {
    open: confirm,
    setOpen: setConfirm,
    trigger,
    cancel,
  } = useInlineConfirmation();
  return (
    <div
      className="seating-remove"
      onKeyDown={(e) => {
        if (e.key === "Escape") setConfirm(false);
      }}
    >
      {confirm ? (
        <div role="group" aria-label={i18n("Quitar {v0}", { v0: name })}>
          <strong>
            {i18n("¿Quitar")} {name}?
          </strong>
          <p>{description}</p>
          <div>
            <button
              ref={cancel}
              type="button"
              onClick={() => setConfirm(false)}
            >
              {i18n("Cancelar")}
            </button>
            <button type="button" className="seating-danger" onClick={onRemove}>
              {i18n("Sí, quitar")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="seating-remove-trigger"
          ref={trigger}
          onClick={() => setConfirm(true)}
        >
          <Icon name="lucide:trash-2" />
          {i18n("Quitar")} {name}
        </button>
      )}
    </div>
  );
}
