import Icon from "@/components/icon";
import { useInlineConfirmation } from "@/components/use-inline-confirmation";
export default function OwnerGiftActions({
  reserved,
  delivered,
  busy,
  title,
  onEdit,
  onRemove,
  onReservation,
}: {
  reserved: boolean;
  delivered: boolean;
  busy: boolean;
  title: string;
  onEdit: () => void;
  onRemove: () => void;
  onReservation: (action: "release" | "delivered" | "pending") => void;
}) {
  const { open, setOpen, trigger, cancel } = useInlineConfirmation();
  return (
    <div
      className="gift-owner-actions"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      {open ? (
        <div
          className="gift-owner-confirm"
          role="group"
          aria-label={reserved ? "Liberar reserva" : "Eliminar regalo"}
        >
          <strong>
            {reserved
              ? "¿Liberar este regalo?"
              : "¿Quitar este regalo de la lista?"}
          </strong>
          <p>
            {reserved
              ? "Otra persona podrá elegirlo al liberar la reserva."
              : title}
          </p>
          <div>
            <button
              type="button"
              className="gift-secondary"
              ref={cancel}
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="gift-danger"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                if (reserved) onReservation("release");
                else onRemove();
              }}
            >
              {reserved ? "Sí, liberar" : "Sí, quitar"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {reserved ? (
            <button
              type="button"
              className="gift-secondary gift-delivery-action"
              disabled={busy}
              onClick={() => onReservation(delivered ? "pending" : "delivered")}
            >
              <Icon name={delivered ? "lucide:undo-2" : "check"} />
              {delivered ? "Marcar pendiente" : "Marcar recibido"}
            </button>
          ) : (
            <button
              type="button"
              className="gift-secondary"
              disabled={busy}
              onClick={onEdit}
            >
              <Icon name="lucide:pencil" />
              Editar
            </button>
          )}
          <button
            type="button"
            className="gift-owner-remove"
            ref={trigger}
            aria-label={
              reserved ? `Liberar reserva de ${title}` : `Eliminar ${title}`
            }
            disabled={busy}
            onClick={() => setOpen(true)}
          >
            <Icon name={reserved ? "lucide:unlink" : "lucide:trash"} />
            {reserved ? "Liberar" : "Quitar"}
          </button>
        </>
      )}
    </div>
  );
}
