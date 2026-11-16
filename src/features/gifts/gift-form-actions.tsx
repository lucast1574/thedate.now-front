import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

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
          aria-label={i18n("Descartar edición del regalo")}
        >
          <p>{i18n("¿Descartar los cambios de este regalo?")}</p>
          <button
            type="button"
            className="gift-secondary"
            ref={cancel}
            disabled={busy}
            onClick={() => setOpen(false)}
          >
            {i18n("Seguir editando")}
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
            {i18n("Descartar")}
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
            {editing ? i18n("Cancelar edición") : i18n("Limpiar")}
          </button>
          <button
            type="submit"
            className="gift-primary"
            disabled={busy || fetching}
          >
            {busy
              ? i18n("Guardando…")
              : editing
                ? i18n("Guardar cambios")
                : i18n("Añadir a la lista")}
          </button>
        </>
      )}
    </div>
  );
}
