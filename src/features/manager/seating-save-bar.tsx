import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

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
              ? i18n("Hay nuevas respuestas")
              : dirty
                ? failed
                  ? i18n("No pudimos guardar los cambios")
                  : saving
                    ? i18n("Guardando…")
                    : i18n("Guardando cambios automáticamente…")
                : i18n("Cambios guardados")}
          </strong>
          <small>
            {stale
              ? i18n(
                  "Recarga el plano para incorporar los cambios antes de guardar o descargar.",
                )
              : dirty
                ? failed
                  ? i18n(
                      "Tus cambios siguen aquí. Revisa tu conexión y vuelve a intentarlo.",
                    )
                  : i18n("Puedes seguir organizando; guardamos por ti.")
                : i18n("El plano y las mesas están al día.")}
          </small>
        </div>
      </div>
      {confirmReload ? (
        <div className="seating-reload-confirm">
          <span>{i18n("¿Descartar los cambios sin guardar?")}</span>
          <button
            type="button"
            disabled={busy}
            ref={cancel}
            onClick={() => setConfirmReload(false)}
          >
            {i18n("Cancelar")}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setConfirmReload(false);
              onReload();
            }}
          >
            {i18n("Descartar y recargar")}
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
              {i18n("Recargar plano")}
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
              {i18n("Reintentar guardado")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
