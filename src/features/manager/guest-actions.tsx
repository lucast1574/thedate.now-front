import { useTranslator } from "@/lib/i18n/react";
import { useRef, useState, type FormEvent } from "react";
import Listbox from "@/components/listbox";
import Icon from "@/components/icon";
import { api } from "@/lib/api/client";
import { fullName } from "@/lib/events/attendees";
import type { Guest } from "@/lib/events/types";

export default function GuestActions({
  guest,
  eventId,
  onUpdated,
  blocked,
}: {
  guest: Guest;
  eventId: string;
  onUpdated?: () => Promise<void>;
  blocked?: boolean;
}) {
  const i18n = useTranslator();

  const [mode, setMode] = useState<"idle" | "edit" | "delete">("idle");
  const [choice, setChoice] = useState(
    guest.response === "pending" ? "going" : guest.response,
  );
  const [reason, setReason] = useState(guest.maybeReason || "");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const request = useRef(false);
  const name = fullName(guest);
  async function save(remove = false) {
    if (request.current || blocked) return;
    request.current = true;
    setBusy(true);
    setError("");
    let committed = false;
    try {
      await api(
        `/api/backend/events/${eventId}/guests/${guest.id}`,
        remove ? "DELETE" : "PATCH",
        remove ? undefined : { response: choice, reason },
        i18n,
      );
      committed = true;
      setMode("idle");
      await onUpdated?.();
    } catch (e) {
      setError(
        committed
          ? i18n("El cambio se guardó. Recarga la lista para verlo.")
          : (e as Error).message,
      );
    } finally {
      request.current = false;
      setBusy(false);
    }
  }
  function edit() {
    setChoice(guest.response === "pending" ? "going" : guest.response);
    setReason(guest.maybeReason || "");
    setError("");
    setMode("edit");
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    void save();
  }
  return (
    <div className="guest-actions">
      {mode === "idle" ? (
        <div className="guest-row-buttons">
          <button
            type="button"
            disabled={blocked || busy}
            onClick={edit}
            aria-label={i18n("Editar respuesta de {v0}", { v0: name })}
          >
            <Icon name="lucide:pencil" />
            {i18n("Editar respuesta")}
          </button>
          <button
            type="button"
            disabled={blocked || busy || guest.sendState === "sending"}
            onClick={() => {
              setError("");
              setMode("delete");
            }}
            aria-label={i18n("Eliminar a {v0}", { v0: name })}
          >
            <Icon name="lucide:trash-2" />
            {i18n("Eliminar")}
          </button>
        </div>
      ) : mode === "edit" ? (
        <form className="guest-row-editor" onSubmit={submit}>
          <strong>
            {i18n("Respuesta de")} {name}
          </strong>
          <label>
            {i18n("Asistencia")}{" "}
            <Listbox value={choice} onValueChange={setChoice} disabled={busy}>
              <option value="going">{i18n("Sí, asistirá")}</option>
              <option value="not_going">{i18n("No asistirá")}</option>
              <option value="maybe">{i18n("Tal vez")}</option>
            </Listbox>
          </label>
          {choice === "maybe" && (
            <label>
              {i18n("Motivo")}{" "}
              <textarea
                required
                minLength={3}
                maxLength={2000}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={busy}
              />
            </label>
          )}
          <small>
            {i18n(
              "Se conservarán sus acompañantes. Los cupos y las mesas se ajustarán a la respuesta.",
            )}
          </small>
          <div className="guest-row-buttons">
            <button
              type="submit"
              className="office-button"
              disabled={busy || blocked}
            >
              {busy ? i18n("Guardando…") : i18n("Guardar respuesta")}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setMode("idle")}
            >
              {i18n("Cancelar")}
            </button>
          </div>
        </form>
      ) : (
        <div
          className="guest-row-editor"
          role="group"
          aria-label={i18n("Eliminar a {v0}", { v0: name })}
        >
          <strong>
            {i18n("¿Eliminar a")} {name}?
          </strong>
          <p>
            {i18n(
              "Se quitará de la lista junto con sus acompañantes, se liberarán sus cupos y reservas de regalos y su enlace personal dejará de funcionar.",
            )}
          </p>
          <div className="guest-row-buttons">
            <button
              type="button"
              disabled={busy}
              onClick={() => setMode("idle")}
            >
              {i18n("Cancelar")}
            </button>
            <button
              type="button"
              className="guest-delete-confirm"
              disabled={busy || blocked}
              onClick={() => void save(true)}
            >
              {busy ? i18n("Eliminando…") : i18n("Sí, eliminar")}
            </button>
          </div>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
      {blocked && (
        <small>
          {i18n("Guarda los cambios del plano antes de editar la lista.")}
        </small>
      )}
    </div>
  );
}
