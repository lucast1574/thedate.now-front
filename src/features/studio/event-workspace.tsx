import type { FormEvent } from "react";
import Link from "next/link";
import Alert from "@/components/alert";
import CoupleAccess from "./couple-access";
import EventForm from "./event-form";
import GuestPanel from "./guest-panel";
import PublicationPanel from "./publication-panel";
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
            : "Un día para recordar."}
      </h1>
      <p className="office-lead">
        {selected
          ? "Ajusta los detalles y lleva el control de tus invitados."
          : "Elige una dirección única para compartir con todos."}
      </p>
      <Alert variant="success">{feedback.notice}</Alert>
      <Alert>{feedback.error}</Alert>
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
      {selected && (
        <Link
          className="office-button editor-open"
          href={`/editor/${encodeURIComponent(selected.id)}`}
        >
          Abrir editor de invitación ↗
        </Link>
      )}
      {selected && !selected.isDemo && (
        <Link className="office-button" href={`/manager/${selected.id}`}>
          Invitados, mesas y Excel de entrada ↗
        </Link>
      )}
      {selected &&
        !selected.isDemo &&
        selected.paymentStatus === "paid" &&
        (selected.ownerId === user.id || user.role === "admin") && (
          <CoupleAccess eventId={selected.id} wedding={wedding} />
        )}
      {selected &&
        !selected.isDemo &&
        (selected.ownerId === user.id || user.role === "admin") && (
          <>
            <PublicationPanel
              deployment={actions.deployment}
              publishing={actions.publishing}
              selected={selected}
              busy={feedback.busy}
              paymentsEnabled={paymentsEnabled}
              checkout={() => {
                void feedback.run(actions.checkout);
              }}
              publish={() => {
                void feedback.run(actions.publish, "Despliegue solicitado.");
              }}
            />
            <GuestPanel
              selected={selected}
              guests={events.guests}
              onImported={() => events.refreshGuests(selected)}
              busy={feedback.busy}
              onAdd={(fields) =>
                feedback.run(
                  () => actions.addGuest(fields),
                  "Invitado agregado.",
                )
              }
              sendInvitations={() => {
                void feedback.run(async () => {
                  feedback.setNotice(await actions.sendInvitations());
                });
              }}
            />
          </>
        )}
    </section>
  );
}
