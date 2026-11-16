"use client";
import { useTranslator } from "@/lib/i18n/react";

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
  const i18n = useTranslator();

  const [tab, setTab] = useState(recordTab(initialTab));
  const wedding = event.kind === "wedding";
  return (
    <div
      className={`office workspace ${wedding ? "office-wedding" : "office-general"}`}
    >
      <WorkspaceSidebar
        wedding={wedding}
        user={user}
        active="events"
        eventId={event.id}
      />
      <main className="workspace-content invitation-record">
        <header className="invitation-record-header">
          <Link className="invitation-record-back" href="/">
            <Icon name="lucide:arrow-left" /> {i18n("Mis invitaciones")}
          </Link>
          <p className="office-kicker">{i18n("MI INVITACIÓN")}</p>
          <h1>{event.title}</h1>
          <p className="invitation-record-date">
            {organizationEventDate(event, i18n)}
          </p>
          <nav aria-label={i18n("Datos de la celebración")}>
            {(
              [
                ["invitation", "layout", i18n("Invitación")],
                ["guests", "users", i18n("Invitados")],
                ["tables", "table", i18n("Mesas")],
                ["gifts", "lucide:gift", i18n("Regalos")],
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
