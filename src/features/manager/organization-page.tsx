"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AccountShell from "@/features/account/account-shell";
import { api } from "@/lib/api/client";
import type { Event, User } from "@/lib/events/types";
import { organizationEvents } from "@/lib/events/organization-events";
import OrganizationPreview from "./organization-preview";
import ManagerEventPicker from "./manager-event-picker";
function OrganizationTools({
  wedding,
  tool,
  user,
}: {
  wedding: boolean;
  tool: string;
  user: User;
}) {
  const [events, setEvents] = useState<Event[]>([]),
    [error, setError] = useState(""),
    [loaded, setLoaded] = useState(false);
  const params = useSearchParams(),
    router = useRouter();
  useEffect(() => {
    let active = true;
    api<Event[]>("/api/backend/events?scope=organization")
      .then((list) => {
        if (active)
          setEvents(
            organizationEvents(list, wedding ? "wedding" : "general", user),
          );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoaded(true));
    return () => {
      active = false;
    };
  }, [wedding, user]);
  const selected =
    events.find((e) => e.id === params.get("event")) ||
    (events.length === 1 ? events[0] : undefined);
  useEffect(() => {
    if (selected?.paymentStatus === "paid")
      router.replace(`/manager/${encodeURIComponent(selected.id)}?tab=${tool}`);
  }, [selected?.id, selected?.paymentStatus, tool, router]);
  const hasPaidEvent = events.some(
    (event) => !event.isDemo && event.paymentStatus === "paid",
  );
  return (
    <section className="organization-page">
      <header className="organization-heading">
        <div>
          <h1>
            {tool === "tables"
              ? "Mesas y distribución"
              : tool === "gifts"
                ? "Lista de regalos"
                : "Invitados y respuestas"}
          </h1>
          <p>
            {events.length > 1
              ? wedding
                ? "Selecciona la boda que quieres organizar."
                : "Selecciona el evento que quieres organizar."
              : "Conoce lo que incluye tu evento y abre su espacio de organizaci�n."}
          </p>
        </div>
      </header>
      {error && <p role="alert">{error}</p>}
      {loaded && !error && !selected && events.length > 1 && (
        <ManagerEventPicker events={events} wedding={wedding} tab={tool} />
      )}
      {(selected || !loaded || events.length === 0) && (
        <p role="status">
          {selected
            ? "Abriendo tu evento…"
            : loaded
              ? "Tus herramientas estarán disponibles cuando actives tu evento."
              : "Cargando tus eventos…"}
        </p>
      )}
      {loaded && !error && !hasPaidEvent && (
        <OrganizationPreview
          wedding={wedding}
          tool={tool}
          eventId={selected?.id}
        />
      )}
    </section>
  );
}
export default function OrganizationPage({
  wedding,
  googleEnabled,
}: {
  wedding: boolean;
  googleEnabled: boolean;
}) {
  const params = useSearchParams(),
    value = params.get("tool"),
    tool = value === "tables" || value === "gifts" ? value : "guests";
  return (
    <AccountShell
      wedding={wedding}
      googleEnabled={googleEnabled}
      active={tool}
      eventId={params.get("event") || undefined}
      next="/organizar"
    >
      {(user) => (
        <OrganizationTools wedding={wedding} tool={tool} user={user} />
      )}
    </AccountShell>
  );
}
