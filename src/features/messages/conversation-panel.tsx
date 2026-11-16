import { useState } from "react";
import { useTranslator } from "@/lib/i18n/react";
import { useClock } from "@/components/use-clock";
import type { Event, Guest } from "@/lib/events/types";
import { fullName, responseLabel } from "@/lib/events/attendees";
import GuestActions from "@/features/manager/guest-actions";
import PaymentForm from "@/features/payments/payment-form";
import { useGuestPayments } from "@/features/payments/use-guest-payments";
import MessageMedia from "./message-media";
import ConversationSync from "./conversation-sync";
import ConversationComposer from "./conversation-composer";
import Icon from "@/components/icon";
import type { InboxMessage } from "./types";
import type { useInbox } from "./use-inbox";
export default function ConversationPanel({
  event,
  guest,
  inbox,
  canPayments,
  onGuestUpdated,
}: {
  event: Event;
  guest: Guest;
  inbox: ReturnType<typeof useInbox>;
  canPayments: boolean;
  onGuestUpdated: () => Promise<void>;
}) {
  const i18n = useTranslator(),
    [text, setText] = useState(""),
    [receipt, setReceipt] = useState<InboxMessage | null>(null);
  const ledger = useGuestPayments(event.id, canPayments);
  const now = useClock();
  const current = inbox.conversations.find((c) => c.guestId === guest.id);
  return (
    <section className="inbox-conversation" aria-label={fullName(guest)}>
      <header className="inbox-person">
        <div>
          <h2>{fullName(guest)}</h2>
          <p>{event.title}</p>
          <ConversationSync
            eventId={event.id}
            guestId={guest.id}
            sent={Boolean(guest.sentAt)}
            onSynced={inbox.reload}
          />
        </div>
        <button
          type="button"
          className="inbox-mobile-back"
          onClick={() => inbox.select("")}
        >
          {i18n("Conversaciones")}
        </button>
        <div className="inbox-person-state">
          <span>{responseLabel(guest, now, i18n)}</span>
          <button
            type="button"
            className={
              current?.pending ? "office-button inbox-attend" : undefined
            }
            disabled={inbox.busy || !current}
            onClick={() => void inbox.attend(Boolean(current?.pending))}
          >
            {current?.pending && <Icon name="lucide:check-check" />}
            {current?.pending
              ? i18n("Marcar atendido")
              : i18n("Marcar pendiente")}
          </button>
        </div>
      </header>
      {receipt ? (
        <PaymentForm
          key={receipt.id}
          event={event}
          guest={guest}
          message={receipt}
          payments={ledger.payments}
          onSaved={ledger.refresh}
          onClose={() => setReceipt(null)}
        />
      ) : (
        <>
          <div className="inbox-thread" aria-live="polite">
            {inbox.hasMore && (
              <button
                type="button"
                disabled={inbox.busy}
                onClick={() => void inbox.older()}
              >
                {i18n("Ver mensajes anteriores")}
              </button>
            )}
            {!inbox.messages.length && (
              <p className="inbox-empty">
                {i18n("Todavía no hay mensajes en esta conversación.")}
              </p>
            )}
            {inbox.messages.map((message) => (
              <article
                key={message.id}
                className={`inbox-bubble inbox-${message.direction}`}
              >
                {message.text && <p>{message.text}</p>}
                <MessageMedia message={message} />
                <small>
                  {new Date(message.createdAt).toLocaleString(i18n.locale)} ·{" "}
                  {message.direction === "in"
                    ? "WhatsApp"
                    : message.delivery === "sent"
                      ? i18n("Enviado")
                      : i18n("Envío por verificar")}
                </small>
                {message.direction === "in" && message.media && canPayments && (
                  <div className="inbox-message-actions">
                    {message.paymentRecorded ||
                    ledger.payments.some((p) => p.messageId === message.id) ? (
                      <span>{i18n("Pago registrado con esta imagen")}</span>
                    ) : (
                      <button
                        type="button"
                        disabled={
                          ledger.loading ||
                          Boolean(ledger.error) ||
                          !message.media.available
                        }
                        onClick={() => setReceipt(message)}
                      >
                        {i18n("Registrar pago con este adjunto")}
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
          <details className="inbox-response-actions">
            <summary>{i18n("Actualizar asistencia manualmente")}</summary>
            <GuestActions
              guest={guest}
              eventId={event.id}
              onUpdated={onGuestUpdated}
            />
          </details>
          <ConversationComposer
            recipient={fullName(guest)}
            busy={inbox.busy}
            send={inbox.send}
            text={text}
            onTextChange={setText}
          />
        </>
      )}
      {ledger.error && <p role="alert">{ledger.error}</p>}
    </section>
  );
}
