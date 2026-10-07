"use client";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Kind } from "@/lib/events/types";
import AuthPanel from "./auth-panel";
import StudioHeader from "./studio-header";
import WorkspaceSidebar from "./workspace-sidebar";
import EventGallery from "./event-gallery";
import ProductAlternative from "./product-alternative";
import EventWorkspace from "./event-workspace";
import Alert from "@/components/alert";
import { useFeedback } from "./use-feedback";
import { useStudioSession } from "./use-studio-session";
import { useStudioEvents } from "./use-studio-events";
import { useEventActions } from "./use-event-actions";
export default function Studio({
  portal,
  googleEnabled = false,
  paymentsEnabled = false,
}: {
  portal: Kind;
  googleEnabled?: boolean;
  paymentsEnabled?: boolean;
}) {
  const feedback = useFeedback(),
    session = useStudioSession(portal, feedback.setError),
    events = useStudioEvents(portal, session.user, feedback.setError);
  const actions = useEventActions(
    events.selected,
    events,
    session.user?.role === "admin" ||
      events.selected?.ownerId === session.user?.id,
  );
  const router = useRouter();
  const creating = useSearchParams().get("new") === "1",
    wedding = portal === "wedding";
  async function signOut() {
    await feedback.run(async () => {
      await session.signOut();
      events.reset();
      router.replace("/");
    });
  }
  function create() {
    events.createDraft();
    feedback.clear();
    router.push("/?new=1");
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    await feedback.run(
      events.saveEvent,
      events.selected
        ? "Cambios guardados."
        : "Evento creado. Ya puedes diseñar tu invitación.",
    );
  }
  if (!session.user)
    return (
      <main
        className={`office ${wedding ? "office-wedding" : "office-general"}`}
      >
        <StudioHeader wedding={wedding} />
        {session.loading ? (
          <p className="account-loading">Abriendo tu estudio…</p>
        ) : (
          <AuthPanel
            wedding={wedding}
            googleEnabled={googleEnabled}
            busy={feedback.busy}
            error={feedback.error}
            onClearError={() => feedback.setError("")}
            onSignIn={async (fields, mode) => {
              await feedback.run(async () => {
                await session.signIn(fields, mode);
              });
            }}
          />
        )}
      </main>
    );
  return (
    <main
      className={`office workspace ${wedding ? "office-wedding" : "office-general"}`}
    >
      <WorkspaceSidebar
        wedding={wedding}
        user={session.user}
        onSignOut={() => void signOut()}
      />
      <div className="workspace-content">
        {events.selected || creating ? (
          <EventWorkspace
            user={session.user}
            events={events}
            actions={actions}
            feedback={feedback}
            paymentsEnabled={paymentsEnabled}
            save={save}
          />
        ) : (
          <>
            <Alert>{feedback.error}</Alert>
            <EventGallery
              user={session.user}
              portal={portal}
              events={events.events}
              loading={events.loading}
              onCreate={create}
            />
          </>
        )}
        <ProductAlternative wedding={wedding} footer />
      </div>
    </main>
  );
}
