import { useState } from "react";
import { useTranslator } from "@/lib/i18n/react";
import { responseLabel } from "@/lib/events/attendees";
import { eventReadOnly } from "@/lib/events/event-closure";
import type { Event, Guest } from "@/lib/events/types";
import Icon from "@/components/icon";
import GuestResponseDialog from "@/features/manager/guest-response-dialog";

export default function ConversationAttendance({
  event,
  guest,
  now,
  onUpdated,
}: {
  event: Event;
  guest: Guest;
  now: number;
  onUpdated: () => Promise<void>;
}) {
  const i18n = useTranslator(),
    [open, setOpen] = useState(false),
    [notice, setNotice] = useState(""),
    [syncing, setSyncing] = useState(false);
  const closed = eventReadOnly(event, now);
  return (
    <div className="inbox-response-actions">
      <button
        type="button"
        className="conversation-attendance-action"
        disabled={closed || syncing}
        onClick={() => {
          setNotice("");
          setOpen(true);
        }}
      >
        <Icon name="lucide:user-check" />
        {i18n("Actualizar asistencia")}
      </button>
      <p className="conversation-attendance-hint">
        {closed
          ? i18n("El evento finalizó. La asistencia es de solo lectura.")
          : i18n("Si respondió por mensaje, registra aquí su asistencia.")}
      </p>
      {notice && <p role="status">{notice}</p>}
      {open && (
        <GuestResponseDialog
          guest={guest}
          eventId={event.id}
          currentLabel={responseLabel(guest, now, i18n)}
          allowMaybe={event.maybeEnabled !== false}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            setSyncing(true);
            void onUpdated()
              .then(() => setNotice(i18n("Asistencia actualizada.")))
              .catch(() =>
                setNotice(
                  i18n("El cambio se guardó. Recarga la lista para verlo."),
                ),
              )
              .finally(() => setSyncing(false));
          }}
        />
      )}
    </div>
  );
}
