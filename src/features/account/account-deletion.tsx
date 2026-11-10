import ConfirmationDialog from "@/components/confirmation-dialog";
import Alert from "@/components/alert";
import { useAccountDeletion } from "./use-account-deletion";

export default function AccountDeletion({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const deletion = useAccountDeletion();
  return (
    <section
      className="account-deletion"
      aria-labelledby="delete-account-title"
    >
      <div>
        <h2 id="delete-account-title">Eliminar cuenta</h2>
        <p>
          Borra tu cuenta y los datos asociados de este producto de forma
          permanente. Esta acción no se puede deshacer.
        </p>
      </div>
      <button
        type="button"
        className="account-delete-button"
        disabled={disabled || deletion.busy}
        onClick={() => deletion.setOpen(true)}
      >
        Eliminar mi cuenta
      </button>
      {deletion.open && (
        <ConfirmationDialog
          title="¿Eliminar tu cuenta definitivamente?"
          busy={deletion.busy}
          onClose={() => deletion.setOpen(false)}
        >
          <p>
            Se eliminarán tu perfil, tus eventos, invitados, fotos, audios y
            solicitudes de soporte. Tus invitaciones publicadas dejarán de estar
            disponibles y perderás el acceso a los eventos que te compartieron.
          </p>
          <p>
            Los eventos de otras personas se conservan. La cuenta que tengas en
            el otro producto se gestiona por separado. Esto no elimina tu cuenta
            de Google ni solicita un reembolso de tus pagos.
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
              Conservar mi cuenta
            </button>
            <button
              type="button"
              className="account-delete-button account-delete-confirm"
              disabled={deletion.busy}
              onClick={() => void deletion.confirm()}
            >
              {deletion.busy ? "Eliminando cuenta…" : "Sí, eliminar mi cuenta"}
            </button>
          </div>
        </ConfirmationDialog>
      )}
    </section>
  );
}
