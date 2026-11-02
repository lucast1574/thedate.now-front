"use client";
import { SharingDemo } from "./sharing-demo";
export { SharingDemo } from "./sharing-demo";
import { useEventReadOnly } from "./use-event-read-only";
import { useEffect, useState } from "react";
import Link from "next/link";
import AccountShell from "@/features/account/account-shell";
import ProfessionalUpgrade from "./professional-upgrade";
import CoupleAccess from "./couple-access";
import Listbox from "@/components/listbox";
import Icon from "@/components/icon";
import Alert from "@/components/alert";
import { api } from "@/lib/api/client";
import type { Event, User } from "@/lib/events/types";
export default function SharedCelebrations({
  wedding,
  googleEnabled,
}: {
  wedding: boolean;
  googleEnabled: boolean;
}) {
  return (
    <AccountShell
      wedding={wedding}
      googleEnabled={googleEnabled}
      active="collaboration"
      next="/compartir"
    >
      {(user, update) =>
        user.role === "admin" ||
        user.role === (wedding ? "planner" : "organizer") ? (
          <SharedWorkspace user={user} wedding={wedding} />
        ) : (
          <ProfessionalUpgrade wedding={wedding} onUpgrade={update} />
        )
      }
    </AccountShell>
  );
}
function SharedWorkspace({ user, wedding }: { user: User; wedding: boolean }) {
  const [events, setEvents] = useState<Event[]>([]),
    [selected, setSelected] = useState(""),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api<Event[]>("/api/backend/events?scope=sharing")
      .then((list) => {
        if (active)
          setEvents(
            list.filter(
              (e) =>
                e.kind === (wedding ? "wedding" : "general") &&
                !e.isDemo &&
                e.paymentStatus === "paid" &&
                (e.ownerId === user.id || user.role === "admin"),
            ),
          );
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [wedding, user.id, user.role]);
  const event = events.find((e) => e.id === selected) || events[0];
  const readOnly = useEventReadOnly(event);
  return (
    <section className="shared-celebrations">
      <header className="shared-heading">
        <p className="office-kicker">TU ESPACIO PROFESIONAL</p>
        <h1>
          {wedding
            ? "Su historia. Un mismo equipo."
            : "Grandes planes, en equipo."}
        </h1>
        <p>
          {wedding
            ? "Conecta cada boda con sus protagonistas. Tú coordinas; ellos aportan su historia."
            : "Asigna cada celebración a sus protagonistas y organizad juntos cada detalle."}
        </p>
      </header>
      <div className="shared-journey">
        {[
          ["check", "1 · Elige una celebración pagada"],
          ["users", "2 · Añade sus dos correos"],
          ["heart", "3 · Planificad juntos"],
        ].map(([icon, label]) => (
          <span key={label}>
            <Icon name={icon} />
            {label}
          </span>
        ))}
      </div>
      <Alert>{error}</Alert>
      {!loaded ? (
        <p role="status">Preparando tus celebraciones…</p>
      ) : event ? (
        <div className="shared-workbench">
          <aside className="shared-event-card">
            <span className="shared-paid">
              <Icon name="check" />
              Lista para compartir
            </span>
            <label>
              {wedding ? "Selecciona la boda" : "Selecciona el evento"}
              <Listbox value={event.id} onValueChange={setSelected}>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </Listbox>
            </label>
            <h2>{event.title}</h2>
            <p>{event.location}</p>
            <Link href={`/editor/${event.id}`}>
              Abrir su invitación <Icon name="external" />
            </Link>
            <small>
              Cada celebración conserva su propio equipo. Puedes gestionar
              tantas bodas o eventos como necesites.
            </small>
          </aside>
          <CoupleAccess
            key={event.id}
            eventId={event.id}
            wedding={wedding}
            readOnly={readOnly}
          />
        </div>
      ) : (
        <SharingDemo wedding={wedding} />
      )}
    </section>
  );
}
