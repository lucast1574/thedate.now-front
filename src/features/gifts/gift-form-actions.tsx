import { useInlineConfirmation } from "@/components/use-inline-confirmation";
export default function GiftFormActions({
  busy,
  fetching,
  editing,
  dirty,
  onCancel,
}: {
  busy: boolean;
  fetching: boolean;
  editing: boolean;
  dirty: boolean;
  onCancel: () => void;
}) {
  const { open, setOpen, trigger, cancel } = useInlineConfirmation();
  return (
    <div
      className="gift-form-actions"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      {open ? (
        <div
          className="gift-form-discard"
          role="group"
          aria-label="Descartar edición del regalo"
        >
          <p>¿Descartar los cambios de este regalo?</p>
          <button
            type="button"
            className="gift-secondary"
            ref={cancel}
            disabled={busy}
            onClick={() => setOpen(false)}
          >
            Seguir editando
          </button>
          <button
            type="button"
            className="gift-secondary"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onCancel();
            }}
          >
            Descartar
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="gift-secondary"
            ref={trigger}
            disabled={busy || (!dirty && !editing)}
            onClick={() => (dirty ? setOpen(true) : onCancel())}
          >
            {editing ? "Cancelar edición" : "Limpiar"}
          </button>
          <button
            type="submit"
            className="gift-primary"
            disabled={busy || fetching}
          >
            {busy
              ? "Guardando…"
              : editing
                ? "Guardar cambios"
                : "Añadir a la lista"}
          </button>
        </>
      )}
    </div>
  );
}
