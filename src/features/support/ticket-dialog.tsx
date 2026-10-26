"use client";
import { useEffect, useRef } from "react";
import Icon from "@/components/icon";
import type { Ticket } from "@/lib/support/types";
import TicketDetail from "./ticket-detail";
export default function TicketDialog({
  ticket,
  onClose,
  onUpdated,
}: {
  ticket: Ticket;
  onClose(): void;
  onUpdated(): void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="support-ticket-dialog"
      aria-label="Detalle del ticket"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="support-ticket-dialog-content">
        <button
          className="support-dialog-close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle"
        >
          <Icon name="close" />
        </button>
        <TicketDetail ticket={ticket} admin onUpdated={onUpdated} />
      </div>
    </dialog>
  );
}
