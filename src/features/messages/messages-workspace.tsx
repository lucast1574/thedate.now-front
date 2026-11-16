"use client";
import { useSearchParams } from "next/navigation";
import { useTranslator } from "@/lib/i18n/react";
import type { Event, Guest } from "@/lib/events/types";
import { fullName, responseLabel } from "@/lib/events/attendees";
import Alert from "@/components/alert";
import Icon from "@/components/icon";
import { useClock } from "@/components/use-clock";
import { useInbox } from "./use-inbox";
import ConversationPanel from "./conversation-panel";
export default function MessagesWorkspace({
  event,
  guests,
  canPayments,
  onGuestUpdated,
}: {
  event: Event;
  guests: Guest[];
  canPayments: boolean;
  onGuestUpdated: () => Promise<void>;
}) {
  const i18n = useTranslator(),
    params = useSearchParams();
  const inbox = useInbox(event.id, params.get("guest") || undefined);
  const now = useClock();
  const selected = guests.find((g) => g.id === inbox.guestId);
  return (
    <div className="messages-workspace">
      <Alert>{inbox.error}</Alert>
      <div className="inbox-heading">
        <p>
          {i18n(
            "Los mensajes permanecen visibles aunque la encuesta ya esté respondida.",
          )}
        </p>
        <span>
          {i18n("{v0} pendientes de atender", {
            v0: String(inbox.conversations.filter((c) => c.pending).length),
          })}
        </span>
      </div>
      <div className={`inbox-layout ${selected ? "has-conversation" : ""}`}>
        <aside className="inbox-list" aria-label={i18n("Conversaciones")}>
          {inbox.loading && <p role="status">{i18n("Cargando mensajes…")}</p>}
          {!inbox.loading && !inbox.conversations.length && (
            <div className="inbox-empty">
              <Icon name="lucide:messages-square" />
              <h2>{i18n("Aquí verás lo que escriben")}</h2>
              <p>
                {i18n(
                  "Cuando un invitado envíe un mensaje o una foto al WhatsApp de la invitación, aparecerá aquí.",
                )}
              </p>
            </div>
          )}
          {inbox.conversations.map((conversation) => {
            const guest = guests.find((g) => g.id === conversation.guestId);
            if (!guest) return null;
            return (
              <button
                key={guest.id}
                type="button"
                className={guest.id === selected?.id ? "is-selected" : ""}
                aria-pressed={guest.id === selected?.id}
                onClick={() => inbox.select(guest.id)}
              >
                <span>
                  <strong>{fullName(guest)}</strong>
                  {conversation.unread && (
                    <small className="inbox-new">{i18n("Nuevo")}</small>
                  )}
                </span>
                <small>{responseLabel(guest, now, i18n)}</small>
                <p>{conversation.last.text || i18n("Adjunto recibido")}</p>
                <span>
                  <small>
                    {new Date(conversation.last.createdAt).toLocaleDateString(
                      i18n.locale,
                    )}
                  </small>
                  <small>
                    {conversation.pending
                      ? i18n("Pendiente")
                      : i18n("Atendido")}
                  </small>
                </span>
              </button>
            );
          })}
        </aside>
        {selected ? (
          <ConversationPanel
            key={selected.id}
            event={event}
            guest={selected}
            inbox={inbox}
            canPayments={canPayments}
            onGuestUpdated={onGuestUpdated}
          />
        ) : (
          <div className="inbox-select-empty">
            <Icon name="lucide:message-circle" />
            <h2>{i18n("Elige una conversación")}</h2>
            <p>
              {i18n(
                "Lee, responde y gestiona lo que te enviaron desde un mismo lugar.",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
