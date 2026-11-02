"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import WorkspaceSidebar from "@/features/studio/workspace-sidebar";
import type { Event, User } from "@/lib/events/types";
import { organizationEventDate } from "@/lib/events/organization-events";
import EventRecordDetails, {
  recordTab,
  type RecordTab,
} from "@/features/manager/records/event-record-details";
import DesignPreview from "./design-preview";

export default function InvitationRecord({
  event,
  user,
  initialTab = "invitation",
}: {
  event: Event;
  user: User;
  initialTab?: RecordTab;
}) {
  const [tab, setTab] = useState(recordTab(initialTab));
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
                ["invitation", "layout", "Invitación"],
                ["guests", "users", "Invitados"],
                ["tables", "table", "Mesas"],
                ["gifts", "lucide:gift", "Regalos"],
              ] as const
            ).map(([value, icon, label]) => (
              <button
                type="button"
                key={value}
                aria-pressed={tab === value}
                onClick={() => setTab(value)}
              >
                <Icon name={icon} /> {label}
              </button>
            ))}
          </nav>
        </header>
        <div hidden={tab !== "invitation"}>
          <DesignPreview draft={event} downloadable />
        </div>
        {tab !== "invitation" && <EventRecordDetails event={event} tab={tab} />}
      </main>
    </div>
  );
}
