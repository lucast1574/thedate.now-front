import { useState } from "react";
import GuestForm from "@/features/studio/guest-form";
import GuestImport from "@/features/studio/guest-import";
import GuestRoster from "./guest-roster";
import type { useManager } from "./use-manager";

export default function GuestWorkspace({
  manager,
}: {
  manager: ReturnType<typeof useManager>;
}) {
  const [tool, setTool] = useState<"add" | "import" | null>(null);
  if (!manager.event) return null;
  return (
    <section
      className="guest-workspace"
      aria-labelledby="guest-workspace-title"
    >
      <header className="guest-workspace-heading">
        <div>
          <h2 id="guest-workspace-title">Tu lista de invitados</h2>
          <p>
            Organiza a tus invitados y consulta sus respuestas. Se actualizan
            automáticamente.
          </p>
        </div>
        <div className="guest-workspace-actions">
          <button
            type="button"
            aria-expanded={tool === "import"}
            aria-controls="guest-entry-panel"
            onClick={() => setTool(tool === "import" ? null : "import")}
          >
            Importar lista
          </button>
          <button
            type="button"
            className="office-button"
            aria-expanded={tool === "add"}
            aria-controls="guest-entry-panel"
            onClick={() => setTool(tool === "add" ? null : "add")}
          >
            Añadir invitado
          </button>
        </div>
      </header>
      <div id="guest-entry-panel" hidden={!tool} className="guest-entry-panel">
        {tool && (
          <button
            type="button"
            className="guest-entry-close"
            onClick={() => setTool(null)}
          >
            Cerrar formulario
          </button>
        )}
        {tool === "add" && (
          <GuestForm busy={manager.busy} onAdd={manager.add} />
        )}
        {tool === "import" && (
          <GuestImport
            eventId={manager.event.id}
            onImported={() => manager.refresh()}
          />
        )}
      </div>
      <GuestRoster guests={manager.guests} plan={manager.plan} />
    </section>
  );
}
