"use client";
import { useSearchParams } from "next/navigation";
import { useTranslator } from "@/lib/i18n/react";
import type { Event, Guest } from "@/lib/events/types";
import Alert from "@/components/alert";
import Icon from "@/components/icon";
import { useClock } from "@/components/use-clock";
import { useInbox } from "./use-inbox";
import ConversationPanel from "./conversation-panel";
import ConversationList from "./conversation-list";
export default function MessagesWorkspace({
  event,
  guests,
  canPayments,
  onGuestUpdated,
  active = true,
}: {
  event: Event;
  guests: Guest[];
  canPayments: boolean;
  onGuestUpdated: () => Promise<void>;
  active?: boolean;
}) {
  const i18n = useTranslator(),
    params = useSearchParams();
  const inbox = useInbox(event.id, params.get("guest") || undefined, active);
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
        <ConversationList
          guests={guests}
          conversations={inbox.conversations}
          loading={inbox.loading}
          selectedId={selected?.id}
          onSelect={inbox.select}
          now={now}
        />
        {selected ? (
          <ConversationPanel
            key={selected.id}
            event={event}
            guest={selected}
            inbox={inbox}
            canPayments={canPayments}
            active={active}
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
