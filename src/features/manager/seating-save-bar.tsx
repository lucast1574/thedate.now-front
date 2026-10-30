import { useInlineConfirmation } from "@/components/use-inline-confirmation";
import Icon from "@/components/icon";
export default function SeatingSaveBar({
  busy,
  dirty,
  stale,
  version,
  onSave,
  onReload,
}: {
  busy: boolean;
  dirty: boolean;
  stale: boolean;
  version: number;
  onSave: () => void;
  onReload: () => void;
}) {
  const {
    open: confirmReload,
    setOpen: setConfirmReload,
    trigger,
    cancel,
  } = useInlineConfirmation();
  return (
    <div
      className="seating-save-bar"
      onKeyDown={(e) => {
        if (e.key === "Escape") setConfirmReload(false);
      }}
    >
      <div className="seating-save-state" role="status" aria-live="polite">
        <Icon name={stale ? "refresh" : dirty ? "clock" : "check"} />
        <div>
          <strong>
            {stale
              ? "Hay nuevas respuestas"
              : dirty
                ? "Cambios sin guardar"
                : "Plano guardado"}
          </strong>
          <small>
            {stale
              ? "Recarga el plano para incorporar los cambios antes de guardar o descargar."
              : dirty
                ? "Guarda para conservar la distribución y las asignaciones."
                : `Todo está al día · versión ${version}`}
          </small>
        </div>
      </div>
      {confirmReload ? (
        <div className="seating-reload-confirm">
          <span>¿Descartar los cambios sin guardar?</span>
          <button
            type="button"
            disabled={busy}
            ref={cancel}
            onClick={() => setConfirmReload(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setConfirmReload(false);
              onReload();
            }}
          >
            Descartar y recargar
          </button>
        </div>
      ) : (
        <div className="seating-save-actions">
          <button
            type="button"
            disabled={busy}
            ref={trigger}
            onClick={() => (dirty ? setConfirmReload(true) : onReload())}
          >
            <Icon name="refresh" />
            Recargar plano
          </button>
          <button
            type="button"
            className="office-button"
            disabled={busy || !dirty || stale}
            onClick={onSave}
          >
            <Icon name="check" />
            {busy ? "Un momento…" : "Guardar plano"}
          </button>
        </div>
      )}
    </div>
  );
}
