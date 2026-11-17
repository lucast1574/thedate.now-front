import { useEffect, useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslator } from "@/lib/i18n/react";
import type { Event, Guest } from "@/lib/events/types";
import Icon from "@/components/icon";
import PaymentsWorkspace from "@/features/payments/payments-workspace";
import MessagesWorkspace from "./messages-workspace";

export default function MessageCenter({
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
    router = useRouter(),
    params = useSearchParams(),
    id = useId();
  const payments =
    canPayments &&
    (params.get("view") === "payments" || params.get("tab") === "payments");
  const [openedPayments, setOpenedPayments] = useState(payments);
  useEffect(() => {
    if (params.get("tab") !== "payments") return;
    const query = new URLSearchParams(params.toString());
    query.set("tab", "messages");
    if (canPayments) query.set("view", "payments");
    else query.delete("view");
    router.replace(`/manager/${event.id}?${query}`, { scroll: false });
  }, [params, router, event.id, canPayments]);
  function select(view: "conversations" | "payments") {
    if (view === "payments") setOpenedPayments(true);
    const query = new URLSearchParams(params.toString());
    query.set("tab", "messages");
    if (view === "payments") query.set("view", view);
    else query.delete("view");
    router.replace(`/manager/${event.id}?${query}`, { scroll: false });
  }
  return (
    <section className="message-center" aria-label={i18n("Mensajes")}>
      {canPayments && (
        <div
          className="message-center-tabs"
          role="tablist"
          aria-label={i18n("Mensajes y pagos")}
          onKeyDown={(e) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key))
              return;
            e.preventDefault();
            const tabs = Array.from(
              e.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="tab"]',
              ),
            );
            const next =
              e.key === "Home" ? 0 : e.key === "End" ? 1 : payments ? 0 : 1;
            tabs[next]?.focus();
            tabs[next]?.click();
          }}
        >
          <button
            type="button"
            role="tab"
            id={`${id}-conversations`}
            aria-controls={`${id}-thread`}
            aria-selected={!payments}
            tabIndex={payments ? -1 : 0}
            onClick={() => select("conversations")}
          >
            <Icon name="lucide:messages-square" />
            {i18n("Conversaciones")}
          </button>
          <button
            type="button"
            role="tab"
            id={`${id}-payments`}
            aria-controls={`${id}-ledger`}
            aria-selected={payments}
            tabIndex={payments ? 0 : -1}
            onClick={() => select("payments")}
          >
            <Icon name="lucide:banknote" />
            {i18n("Pagos")}
          </button>
        </div>
      )}
      <div
        hidden={payments}
        role={canPayments ? "tabpanel" : undefined}
        id={`${id}-thread`}
        aria-labelledby={canPayments ? `${id}-conversations` : undefined}
      >
        <MessagesWorkspace
          key={params.get("guest") || "conversations"}
          event={event}
          guests={guests}
          canPayments={canPayments}
          active={!payments}
          onGuestUpdated={onGuestUpdated}
        />
      </div>
      {canPayments && (
        <div
          hidden={!payments}
          role="tabpanel"
          id={`${id}-ledger`}
          aria-labelledby={`${id}-payments`}
        >
          {(payments || openedPayments) && (
            <PaymentsWorkspace
              event={event}
              guests={guests}
              active={payments}
            />
          )}
        </div>
      )}
    </section>
  );
}
