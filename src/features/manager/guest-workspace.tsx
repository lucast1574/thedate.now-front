import GuestForm from "@/features/studio/guest-form";
import GuestImport from "@/features/studio/guest-import";
import Icon from "@/components/icon";
import GuestRoster from "./guest-roster";
import type { useManager } from "./use-manager";

export default function GuestWorkspace({
  manager,
}: {
  manager: ReturnType<typeof useManager>;
}) {
  if (!manager.event) return null;
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
          eventId={manager.event.id}
          disabled={manager.busy}
          onImported={() => manager.refresh()}
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
          <GuestForm busy={manager.busy} onAdd={manager.add} />
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
      />
    </section>
  );
}
