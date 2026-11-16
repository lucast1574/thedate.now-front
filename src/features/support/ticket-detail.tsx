import { useTranslator } from "@/lib/i18n/react";
import { useState } from "react";
import Listbox from "@/components/listbox";
import ActionButton from "@/components/action-button";
import Alert from "@/components/alert";
import Photo from "@/components/photo";
import { api } from "@/lib/api/client";
import {
  supportStates,
  ticketDate,
  ticketStateLabel,
  type Ticket,
} from "@/lib/support/types";

export default function TicketDetail({
  ticket,
  admin,
  onUpdated,
}: {
  ticket: Ticket;
  admin: boolean;
  onUpdated: () => void;
}) {
  const i18n = useTranslator();

  const [state, setState] = useState(ticket.state),
    [note, setNote] = useState("");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function save() {
    setBusy(true);
    setError("");
    try {
      await api(
        `/api/backend/admin/support/tickets/${ticket.id}`,
        "PATCH",
        {
          state,
          note: note.trim(),
          version: ticket.version,
        },
        i18n,
      );
      onUpdated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <article
      className="support-detail"
      aria-label={i18n("Detalle del reporte")}
    >
      <span className="support-state" data-state={ticket.state}>
        {ticketStateLabel(ticket.state, i18n)}
      </span>
      <h3>{ticket.title}</h3>
      <p className="support-hint">
        {i18n("Enviado el")} {ticketDate(ticket.createdAt, i18n.locale)}
      </p>
      {ticket.requester && (
        <div className="support-requester">
          <strong>{ticket.requester.name}</strong>
          <span>{ticket.requester.email}</span>
        </div>
      )}
      <p className="support-description">{ticket.description}</p>
      {ticket.images.length > 0 && (
        <div className="support-screenshots">
          {ticket.images.map((url, index) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              <Photo src={url} alt={`Captura adjunta ${index + 1}`} />
              <span>
                {i18n("Abrir captura")} {index + 1}
              </span>
            </a>
          ))}
        </div>
      )}
      <h4>{i18n("Seguimiento")}</h4>
      <ol className="support-history">
        {ticket.history.map((change, index) => (
          <li key={`${change.at}-${index}`}>
            <div>
              <strong>{ticketStateLabel(change.state, i18n)}</strong>
              <time dateTime={change.at}>
                {ticketDate(change.at, i18n.locale)}
              </time>
            </div>
            {change.note && <p>{change.note}</p>}
          </li>
        ))}
      </ol>
      {admin && ticket.state !== "DONE" && (
        <div className="support-update">
          <h4>{i18n("Actualizar reporte")}</h4>
          <Alert>{error}</Alert>
          <label>
            {i18n("Estado")}{" "}
            <Listbox
              aria-label={i18n("Estado del reporte")}
              value={state}
              onValueChange={(value) => setState(value as Ticket["state"])}
              disabled={busy}
            >
              {supportStates(i18n).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Listbox>
          </label>
          <label>
            {i18n("Respuesta al usuario")}{" "}
            <textarea
              rows={3}
              maxLength={1500}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={i18n(
                "Indica qué revisaste o qué información necesitas.",
              )}
              disabled={busy}
            />
          </label>
          <ActionButton
            type="button"
            onClick={() => void save()}
            disabled={busy || (state === ticket.state && !note.trim())}
          >
            {busy ? i18n("Guardando…") : i18n("Guardar seguimiento")}
          </ActionButton>
        </div>
      )}
      {ticket.state === "DONE" && (
        <p className="support-closed">
          {i18n(
            "Reporte resuelto. Si encuentras otro problema, puedes crear un nuevo reporte.",
          )}
        </p>
      )}
    </article>
  );
}
