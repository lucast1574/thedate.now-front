import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

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
          aria-label={
            reserved ? i18n("Liberar reserva") : i18n("Eliminar regalo")
          }
        >
          <strong>
            {reserved
              ? i18n("¿Liberar este regalo?")
              : i18n("¿Quitar este regalo de la lista?")}
          </strong>
          <p>
            {reserved
              ? i18n("Otra persona podrá elegirlo al liberar la reserva.")
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
              {i18n("Cancelar")}
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
              {reserved ? i18n("Sí, liberar") : i18n("Sí, quitar")}
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
              {delivered ? i18n("Marcar pendiente") : i18n("Marcar recibido")}
            </button>
          ) : (
            <button
              type="button"
              className="gift-secondary"
              disabled={busy}
              onClick={onEdit}
            >
              <Icon name="lucide:pencil" />
              {i18n("Editar")}
            </button>
          )}
          <button
            type="button"
            className="gift-owner-remove"
            ref={trigger}
            aria-label={
              reserved
                ? i18n("Liberar reserva de {v0}", { v0: title })
                : i18n("Eliminar {v0}", { v0: title })
            }
            disabled={busy}
            onClick={() => setOpen(true)}
          >
            <Icon name={reserved ? "lucide:unlink" : "lucide:trash"} />
            {reserved ? i18n("Liberar") : i18n("Quitar")}
          </button>
        </>
      )}
    </div>
  );
}
