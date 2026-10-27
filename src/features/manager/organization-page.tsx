"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AccountShell from "@/features/account/account-shell";
import Listbox from "@/components/listbox";
import Icon from "@/components/icon";
import { api } from "@/lib/api/client";
import type { Event } from "@/lib/events/types";
import OrganizationPreview from "./organization-preview";
function OrganizationTools({
  wedding,
  tool,
}: {
  wedding: boolean;
  tool: string;
}) {
  const [events, setEvents] = useState<Event[]>([]),
    [error, setError] = useState(""),
    [loaded, setLoaded] = useState(false);
  const params = useSearchParams(),
    router = useRouter();
  useEffect(() => {
    let active = true;
    api<Event[]>("/api/backend/events")
      .then((list) => {
        if (active)
          setEvents(
            list.filter((e) => e.kind === (wedding ? "wedding" : "general")),
          );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoaded(true));
    return () => {
      active = false;
    };
  }, [wedding]);
  const selected =
    events.find((e) => e.id === params.get("event")) ||
    events.find((e) => !e.isDemo && e.paymentStatus === "paid") ||
    events.find((e) => !e.isDemo) ||
    events[0];
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
            Conoce lo que incluye tu evento y abre su espacio de organización.
          </p>
        </div>
      </header>
      {error && <p role="alert">{error}</p>}
      {selected ? (
        <div className="organization-event-picker">
          <label>
            Evento
            <Listbox
              value={selected.id}
              onValueChange={(id) =>
                router.replace(`/organizar?tool=${tool}&event=${id}`)
              }
            >
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                  {e.isDemo
                    ? " · Muestra"
                    : e.paymentStatus === "paid"
                      ? " · Activo"
                      : " · Borrador"}
                </option>
              ))}
            </Listbox>
          </label>
          <Link
            className="gift-primary"
            href={`/manager/${selected.id}?tab=${tool}`}
          >
            {tool === "gifts"
              ? "Preparar lista"
              : selected.paymentStatus === "paid" && !selected.isDemo
                ? "Abrir organización"
                : "Explorar este evento"}
            <Icon name="arrow" />
          </Link>
        </div>
      ) : (
        <p role="status">
          {loaded
            ? "Crea un evento para tener tu propio espacio de organización."
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
      {() => <OrganizationTools wedding={wedding} tool={tool} />}
    </AccountShell>
  );
}
