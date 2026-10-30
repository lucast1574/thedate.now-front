import { useInlineConfirmation } from "@/components/use-inline-confirmation";
import type { useSeatingAutosave } from "./use-seating-autosave";
import Icon from "@/components/icon";
export default function SeatingSaveBar({
  busy,
  dirty,
  stale,
  autosave,
  onReload,
}: {
  busy: boolean;
  dirty: boolean;
  stale: boolean;
  autosave: ReturnType<typeof useSeatingAutosave>;
  onReload: () => void;
}) {
  const { saving, failed, retry } = autosave;
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
                ? failed
                  ? "No pudimos guardar los cambios"
                  : saving
                    ? "Guardando…"
                    : "Guardando cambios automáticamente…"
                : "Cambios guardados"}
          </strong>
          <small>
            {stale
              ? "Recarga el plano para incorporar los cambios antes de guardar o descargar."
              : dirty
                ? failed
                  ? "Tus cambios siguen aquí. Revisa tu conexión y vuelve a intentarlo."
                  : "Puedes seguir organizando; guardamos por ti."
                : "El plano y las mesas están al día."}
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
          {stale && (
            <button
              type="button"
              disabled={busy}
              ref={trigger}
              onClick={() => (dirty ? setConfirmReload(true) : onReload())}
            >
              <Icon name="refresh" />
              Recargar plano
            </button>
          )}
          {failed && !stale && (
            <button
              type="button"
              className="seating-retry-save"
              disabled={busy || saving}
              onClick={retry}
            >
              <Icon name="check" />
              Reintentar guardado
            </button>
          )}
        </div>
      )}
    </div>
  );
}
