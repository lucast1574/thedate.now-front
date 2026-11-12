import { useState } from "react";
import GuestForm from "@/features/studio/guest-form";
import GuestImport from "@/features/studio/guest-import";
import Icon from "@/components/icon";
import GuestRoster from "./guest-roster";
import GuestQueueNoticeDialog from "./guest-queue-notice-dialog";
import { guestStats } from "@/lib/events/attendees";
import type { useManager } from "./use-manager";

export default function GuestWorkspace({
  manager,
}: {
  manager: ReturnType<typeof useManager>;
}) {
  const [queueNotice, setQueueNotice] = useState<{
    open: boolean;
    hasSpots: boolean;
  }>({
    open: false,
    hasSpots: true,
  });

  if (!manager.event) return null;

  function checkAndNotify() {
    if (!manager.event?.publishedAt) return;
    const hasActiveSends = Boolean(
      manager.event.invitationsEnabled ||
      manager.guests.some((g) => g.sentAt || g.sendState === "sent"),
    );
    if (!hasActiveSends) return;

    const stats = guestStats(manager.guests, Date.now());
    const awaiting = manager.guests
      .filter((g) => g.invitationHeld)
      .reduce((sum, g) => sum + g.seats, 0);
    const used = stats.confirmed + stats.held + awaiting;
    const hasSpots =
      Boolean(manager.event.capacityUnlimited) ||
      manager.event.capacity - used > 0;

    setQueueNotice({ open: true, hasSpots });
  }

  return (
    <section
      className="guest-workspace"
      aria-labelledby="guest-workspace-title"
    >
      <header className="guest-workspace-heading">
        <div>
          <p className="journey-eyebrow">TU LISTA, A TU MANERA</p>
          <h2 id="guest-workspace-title">¿A quiénes quieres invitar?</h2>
          <p>
            Sube tu lista o añade personas una a una. Aquí puedes hacer ambas
            cosas.
          </p>
        </div>
      </header>
      <div className="guest-entry-methods">
        <GuestImport
          kind={manager.event.kind}
          eventId={manager.event.id}
          disabled={manager.busy}
          onImported={async () => {
            await manager.refresh();
            checkAndNotify();
          }}
        />
        <section className="guest-manual-card">
          <div className="guest-method-heading">
            <Icon name="users" />
            <div>
              <h3>Añade personas a mano</h3>
              <p>No necesitas una hoja de cálculo.</p>
            </div>
          </div>
          <p className="guest-hint">
            Los nuevos invitados se añaden al final de tu lista.
          </p>
          <GuestForm
            kind={manager.event.kind}
            busy={manager.busy}
            onAdd={async (fields) => {
              const ok = await manager.add(fields);
              if (ok) checkAndNotify();
              return ok;
            }}
          />
        </section>
      </div>
      <aside className="guest-queue-guide">
        <Icon name="users" />
        <div>
          <h3>El orden de tu lista importa</h3>
          <p>
            Puedes añadir más personas que el aforo disponible. Invitaremos por
            orden, respetando los cupos de cada familia.
          </p>
          <p>
            Cuando alguien diga que no, confirme menos personas o venza su
            reserva temporal, la siguiente invitación se enviará automáticamente
            si hay espacio para todo su grupo. Nadie recibe un mensaje antes de
            pulsar «Enviar invitaciones».
          </p>
        </div>
      </aside>
      <GuestRoster
        guests={manager.guests}
        plan={manager.plan}
        enabled={manager.event.invitationsEnabled}
        eventId={manager.event.id}
        onUpdated={() => manager.refresh()}
        blocked={manager.busy || manager.dirty}
      />
      {queueNotice.open && (
        <GuestQueueNoticeDialog
          hasSpots={queueNotice.hasSpots}
          onClose={() => setQueueNotice({ open: false, hasSpots: true })}
        />
      )}
    </section>
  );
}
