import { useId, useRef, useState } from "react";
import { useTranslator } from "@/lib/i18n/react";
import type { Guest } from "@/lib/events/types";
import { fullName } from "@/lib/events/attendees";
import CompanionFields from "@/components/companion-fields";
import ConfirmationDialog from "@/components/confirmation-dialog";
import Icon from "@/components/icon";
import GuestResponseOptions from "./guest-response-options";
import { updateGuestResponse } from "./update-guest-response";
export default function GuestResponseDialog({
  guest,
  eventId,
  currentLabel,
  allowMaybe,
  onClose,
  onSaved,
}: {
  guest: Guest;
  eventId: string;
  currentLabel: string;
  allowMaybe: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const i18n = useTranslator(),
    name = useId();
  const [initial] = useState(() =>
    guest.response === "pending" ? "" : guest.response,
  );
  const [originalReason] = useState(guest.maybeReason || ""),
    [choice, setChoice] = useState<string>(initial),
    [reason, setReason] = useState(originalReason);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [discard, setDiscard] = useState(false);
  const saving = useRef(false);
  const [editParty, setEditParty] = useState(false);
  const [companions, setCompanions] = useState(guest.companions || []);
  const updateParty = choice === "going" && editParty;
  const dirty = choice !== initial || reason !== originalReason || updateParty;
  function close() {
    if (busy) return;
    if (dirty) setDiscard(true);
    else onClose();
  }
  return (
    <ConfirmationDialog
      title={i18n("Actualizar asistencia")}
      busy={busy}
      onClose={close}
    >
      <form
        className="guest-response-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (
            saving.current ||
            !dirty ||
            !choice ||
            (choice === "maybe" && reason.trim().length < 3)
          )
            return;
          saving.current = true;
          setBusy(true);
          setError("");
          try {
            await updateGuestResponse(
              eventId,
              guest.id,
              choice,
              reason,
              i18n,
              updateParty ? companions : undefined,
            );
            onSaved();
          } catch (e) {
            setError((e as Error).message);
          } finally {
            saving.current = false;
            setBusy(false);
          }
        }}
      >
        <button
          className="guest-response-close"
          type="button"
          aria-label={i18n("Cerrar")}
          disabled={busy}
          onClick={close}
        >
          <Icon name="lucide:x" />
        </button>
        <div className="guest-response-context">
          <strong>{fullName(guest)}</strong>
          <span>
            {i18n("Respuesta actual")}: {currentLabel}
          </span>
        </div>
        <GuestResponseOptions
          name={name}
          choice={choice}
          allowMaybe={allowMaybe}
          busy={busy}
          onChange={setChoice}
        />
        {choice === "going" && guest.seats > 1 && (
          <fieldset className="guest-response-companions" disabled={busy}>
            <label>
              <input
                type="checkbox"
                checked={editParty}
                onChange={(event) => setEditParty(event.target.checked)}
              />
              {i18n("Registrar acompañantes ahora")}
            </label>
            {editParty && (
              <CompanionFields
                people={companions}
                max={guest.seats - 1}
                onChange={setCompanions}
                description={i18n(
                  "Si dejas la lista vacía, se registrará que asistirá sin acompañantes.",
                )}
              />
            )}
          </fieldset>
        )}
        {choice === "maybe" && (
          <label className="guest-response-reason">
            {i18n("Motivo de la espera")}
            <textarea
              required
              minLength={3}
              maxLength={2000}
              value={reason}
              disabled={busy}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
        )}
        <p className="guest-response-help">
          {i18n(
            "El cambio se aplicará a la lista de invitados y al plano de mesas.",
          )}
        </p>
        {error && (
          <p className="guest-response-error" role="alert">
            {error}
          </p>
        )}
        {discard ? (
          <div className="guest-response-discard" role="alert">
            <p>{i18n("Tienes cambios sin guardar.")}</p>
            <div className="guest-response-actions">
              <button type="button" onClick={() => setDiscard(false)}>
                {i18n("Seguir editando")}
              </button>
              <button type="button" onClick={onClose}>
                {i18n("Descartar cambios")}
              </button>
            </div>
          </div>
        ) : (
          <div className="guest-response-actions">
            <button
              type="button"
              data-dialog-cancel
              disabled={busy}
              onClick={close}
            >
              {i18n("Cancelar")}
            </button>
            <button
              type="submit"
              className="office-button"
              disabled={
                busy ||
                !dirty ||
                !choice ||
                (choice === "maybe" && reason.trim().length < 3)
              }
            >
              {busy ? i18n("Guardando…") : i18n("Guardar asistencia")}
            </button>
          </div>
        )}
      </form>
    </ConfirmationDialog>
  );
}
