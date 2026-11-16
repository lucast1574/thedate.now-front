import { useTranslator } from "@/lib/i18n/react";
import ConfirmationDialog from "@/components/confirmation-dialog";
import Alert from "@/components/alert";
import { useAccountDeletion } from "./use-account-deletion";

export default function AccountDeletion({
  disabled = false,
  compact = false,
}: {
  disabled?: boolean;
  compact?: boolean;
}) {
  const i18n = useTranslator();

  const deletion = useAccountDeletion();
  return (
    <section
      className={`account-deletion${compact ? " account-deletion-compact" : ""}`}
      aria-label={i18n("Eliminar cuenta")}
    >
      {!compact && (
        <div>
          <h2>{i18n("Eliminar cuenta")}</h2>
          <p>
            {i18n(
              "Borra tu cuenta y los datos asociados de este producto de forma permanente. Esta acción no se puede deshacer.",
            )}
          </p>
        </div>
      )}
      <button
        type="button"
        className={compact ? "account-delete-link" : "account-delete-button"}
        disabled={disabled || deletion.busy}
        onClick={() => deletion.setOpen(true)}
      >
        {i18n("Eliminar mi cuenta")}
      </button>
      {deletion.open && (
        <ConfirmationDialog
          title={i18n("¿Eliminar tu cuenta definitivamente?")}
          busy={deletion.busy}
          onClose={() => deletion.setOpen(false)}
        >
          <p>
            {i18n(
              "Se eliminarán tu perfil, tus eventos, invitados, fotos, audios y solicitudes de soporte. Tus invitaciones publicadas dejarán de estar disponibles y perderás el acceso a los eventos que te compartieron.",
            )}
          </p>
          <p>
            {i18n(
              "Los eventos de otras personas se conservan. La cuenta que tengas en el otro producto se gestiona por separado. Esto no elimina tu cuenta de Google ni solicita un reembolso de tus pagos.",
            )}
          </p>
          <Alert>{deletion.error}</Alert>
          <div className="account-confirmation-actions">
            <button
              type="button"
              className="account-cancel-button"
              data-dialog-cancel
              disabled={deletion.busy}
              onClick={() => deletion.setOpen(false)}
            >
              {i18n("Conservar mi cuenta")}
            </button>
            <button
              type="button"
              className="account-delete-button account-delete-confirm"
              disabled={deletion.busy}
              onClick={() => void deletion.confirm()}
            >
              {deletion.busy
                ? i18n("Eliminando cuenta…")
                : i18n("Sí, eliminar mi cuenta")}
            </button>
          </div>
        </ConfirmationDialog>
      )}
    </section>
  );
}
