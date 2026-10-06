"use client";
import type { FormEvent } from "react";
import type { Kind } from "@/lib/events/types";
import Alert from "@/components/alert";
import Link from "next/link";
import AuthPanel from "./auth-panel";
import CoupleAccess from "./couple-access";
import EventForm from "./event-form";
import EventSidebar from "./event-sidebar";
import GuestPanel from "./guest-panel";
import PublicationPanel from "./publication-panel";
import StudioHeader from "./studio-header";
import { useFeedback } from "./use-feedback";
import { useStudioSession } from "./use-studio-session";
import { useStudioEvents } from "./use-studio-events";
import { useEventActions } from "./use-event-actions";

type Props = {
  portal: Kind;
  googleEnabled?: boolean;
  paymentsEnabled?: boolean;
};
export default function Studio({
  portal,
  googleEnabled = false,
  paymentsEnabled = false,
}: Props) {
  const feedback = useFeedback();
  const session = useStudioSession(portal, feedback.setError);
  const events = useStudioEvents(portal, session.user, feedback.setError);
  const actions = useEventActions(
    events.selected,
    events,
    session.user?.role === "admin" ||
      events.selected?.ownerId === session.user?.id,
  );
  const { user } = session;
  const { selected } = events;
  const wedding = portal === "wedding";
  async function save(e: FormEvent) {
    e.preventDefault();
    await feedback.run(
      events.saveEvent,
      selected
        ? "Cambios guardados."
        : "Evento creado. La invitación se publicará después del pago de prueba.",
    );
  }
  return (
    <main className={`office ${wedding ? "office-wedding" : "office-general"}`}>
      <StudioHeader
        wedding={wedding}
        user={user}
        onSignOut={() => {
          void feedback.run(async () => {
            await session.signOut();
            events.reset();
          });
        }}
      />
      {!user ? (
        <AuthPanel
          wedding={wedding}
          googleEnabled={googleEnabled}
          busy={feedback.busy}
          error={feedback.error}
          onClearError={() => feedback.setError("")}
          onSignIn={async (fields, mode) => {
            await feedback.run(async () => {
              const current = await session.signIn(fields, mode);
              feedback.setNotice(`Bienvenido, ${current.name}.`);
            });
          }}
        />
      ) : (
        <div className="office-body">
          <EventSidebar
            user={user}
            portal={portal}
            events={events.events}
            selectedId={selected?.id}
            onCreate={() => {
              events.createDraft();
              feedback.clear();
            }}
            onSelect={(event) => {
              feedback.clear();
              void feedback.run(() => events.select(event));
            }}
          />
          <section className="office-main">
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
            {user.role !== "couple" &&
              !selected?.isDemo &&
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
            {selected?.kind === "wedding" &&
              selected.paymentStatus === "paid" &&
              (selected.ownerId === user.id || user.role === "admin") && (
                <CoupleAccess
                  busy={feedback.busy}
                  onCreate={(fields) =>
                    feedback.run(
                      () => actions.createCouple(fields),
                      "Cuenta creada. Comparte el correo y la contraseña con la pareja por un canal seguro.",
                    )
                  }
                />
              )}
            {selected &&
              !selected.isDemo &&
              (selected.ownerId === user.id || user.role === "admin") && (
                <>
                  <PublicationPanel
                    deployment={actions.deployment}
                    selected={selected}
                    busy={feedback.busy}
                    paymentsEnabled={paymentsEnabled}
                    checkout={() => {
                      void feedback.run(actions.checkout);
                    }}
                    publish={() => {
                      void feedback.run(
                        actions.publish,
                        "Despliegue solicitado.",
                      );
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
        </div>
      )}
    </main>
  );
}
