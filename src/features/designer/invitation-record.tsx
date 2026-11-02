import Link from "next/link";
import Icon from "@/components/icon";
import WorkspaceSidebar from "@/features/studio/workspace-sidebar";
import type { Event, User } from "@/lib/events/types";
import { organizationEventDate } from "@/lib/events/organization-events";
import DesignPreview from "./design-preview";

export default function InvitationRecord({
  event,
  user,
}: {
  event: Event;
  user: User;
}) {
  const wedding = event.kind === "wedding";
  return (
    <div
      className={`office workspace ${wedding ? "office-wedding" : "office-general"}`}
    >
      <WorkspaceSidebar wedding={wedding} user={user} active="events" />
      <main className="workspace-content invitation-record">
        <header className="invitation-record-header">
          <Link className="invitation-record-back" href="/">
            <Icon name="lucide:arrow-left" /> Mis invitaciones
          </Link>
          <p className="office-kicker">MI INVITACIÓN</p>
          <h1>{event.title}</h1>
          <p className="invitation-record-date">
            {organizationEventDate(event)}
          </p>
          <nav aria-label="Datos de la celebración">
            {(
              [
                ["guests", "users", "Invitados"],
                ["tables", "table", "Mesas"],
                ["gifts", "lucide:gift", "Regalos"],
              ] as const
            ).map(([tab, icon, label]) => (
              <Link
                key={tab}
                href={`/manager/${encodeURIComponent(event.id)}?tab=${tab}`}
              >
                <Icon name={icon} /> {label}
              </Link>
            ))}
          </nav>
        </header>
        <DesignPreview draft={event} downloadable />
      </main>
    </div>
  );
}
