"use client";
import { useTranslator } from "@/lib/i18n/react";

import ConfirmationDialog from "@/components/confirmation-dialog";

export default function GuestQueueNoticeDialog({
  hasSpots,
  onClose,
}: {
  hasSpots: boolean;
  onClose: () => void;
}) {
  const i18n = useTranslator();

  return (
    <ConfirmationDialog
      title={
        hasSpots
          ? i18n("Invitación en camino")
          : i18n("En lista de espera automática")
      }
      busy={false}
      onClose={onClose}
    >
      <p>
        {hasSpots
          ? i18n(
              "Tu evento ya está publicado y tiene los envíos automáticos activos. La invitación se enviará automáticamente por WhatsApp a tu nuevo invitado.",
            )
          : i18n(
              "Tu evento ya ha alcanzado el límite de aforo configurado. El nuevo invitado ha sido añadido y su invitación se enviará automáticamente en cuanto otros invitados liberen cupos (si rechazan, confirman menos acompañantes o vence su reserva temporal).",
            )}
      </p>
      <div className="account-confirmation-actions">
        <button
          type="button"
          data-dialog-cancel="true"
          className="account-cancel-button"
          onClick={onClose}
        >
          {i18n("Entendido")}
        </button>
      </div>
    </ConfirmationDialog>
  );
}
