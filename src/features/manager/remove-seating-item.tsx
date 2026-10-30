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
        <div role="group" aria-label={`Quitar ${name}`}>
          <strong>¿Quitar {name}?</strong>
          <p>{description}</p>
          <div>
            <button
              ref={cancel}
              type="button"
              onClick={() => setConfirm(false)}
            >
              Cancelar
            </button>
            <button type="button" className="seating-danger" onClick={onRemove}>
              Sí, quitar
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
          Quitar {name}
        </button>
      )}
    </div>
  );
}
