import { type FormEvent } from "react";
import Link from "next/link";
import Alert from "@/components/alert";

import EventForm from "./event-form";
import PendingPayment from "./pending-payment";
import type { User } from "@/lib/events/types";
import type { useStudioEvents } from "./use-studio-events";
import type { useEventActions } from "./use-event-actions";
import type { useFeedback } from "./use-feedback";
export default function EventWorkspace({
  user,
  events,
  actions,
  feedback,
  paymentsEnabled,
  save,
}: {
  user: User;
  events: ReturnType<typeof useStudioEvents>;
  actions: ReturnType<typeof useEventActions>;
  feedback: ReturnType<typeof useFeedback>;
  paymentsEnabled: boolean;
  save: (e: FormEvent) => Promise<void>;
}) {
  const { selected } = events;
  const wedding = events.draft.kind === "wedding";
  return (
    <section className="office-main workspace-event">
      <Link className="workspace-back" href="/">
        ← Mis invitaciones
      </Link>
      <p className="office-kicker">
        {selected ? "EDITAR EVENTO" : "NUEVO EVENTO"}
      </p>
      <h1>
        {selected?.isDemo
          ? "Tu invitación de muestra"
          : selected
            ? selected.title
            : wedding
              ? "Vamos a crear su invitación."
              : "Prepara tu próxima celebración."}
      </h1>
      <p className="office-lead">
        {selected
          ? "Ajusta los detalles y lleva el control de tus invitados."
          : "Cuéntanos cuándo y dónde. Elige una plantilla y descubre cómo la verán tus invitados."}
      </p>
      <Alert variant="success">{feedback.notice}</Alert>
      <Alert>{feedback.error}</Alert>
      {selected?.addressChangedAfterPayment && !selected.publishedAt && (
        <p role="status">
          El nombre anterior se reservó con otro pago. Tu evento ya está pagado
          y tiene un enlace alternativo; puedes cambiarlo aquí antes de
          publicar.
        </p>
      )}
      <nav className="action-row" aria-label="Accesos de la invitación">
        {selected && (selected.isDemo || selected.paymentStatus === "paid") && (
          <Link
            className="workspace-back"
            href={`/editor/${encodeURIComponent(selected.id)}`}
          >
            Abrir editor de invitación ↗
          </Link>
        )}
        {selected && (selected.isDemo || selected.paymentStatus === "paid") && (
          <Link className="workspace-back" href={`/manager/${selected.id}`}>
            Invitados, mesas y regalos ↗
          </Link>
        )}
      </nav>
      {!selected?.isDemo &&
        (!selected ||
          selected.ownerId === user.id ||
          user.role === "admin") && (
          <EventForm
            key={selected?.id ?? "new"}
            draft={events.draft}
            setDraft={events.setDraft}
            selected={selected}
            busy={feedback.busy}
            onSubmit={save}
          />
        )}
      {selected && !selected.isDemo && selected.paymentStatus !== "paid" && (
        <PendingPayment
          user={user}
          event={selected}
          busy={feedback.busy}
          enabled={paymentsEnabled}
          onCheckout={() => {
            void feedback.run(actions.checkout);
          }}
        />
      )}
    </section>
  );
}
