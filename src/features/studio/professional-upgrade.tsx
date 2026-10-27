import { useState } from "react";
import Icon from "@/components/icon";
import { api } from "@/lib/api/client";
import type { User } from "@/lib/events/types";
export default function ProfessionalUpgrade({
  wedding,
  onUpgrade,
}: {
  wedding: boolean;
  onUpgrade: (user: User) => void;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <section className="professional-upgrade">
      <Icon name="lucide:users-round" />
      <div>
        <strong>
          {wedding
            ? "¿Organizas bodas para otras parejas?"
            : "¿Creas eventos para otras personas?"}
        </strong>
        <p>
          Activa gratis tu espacio profesional y comparte cada celebración con
          sus protagonistas.
        </p>
        {error && <p role="alert">{error}</p>}
      </div>
      <button
        className="office-button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            onUpgrade(
              await api<User>("/api/backend/profile/professional", "POST"),
            );
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy
          ? "Activando…"
          : wedding
            ? "Soy wedding planner"
            : "Soy organizador de eventos"}
        <Icon name="arrow" />
      </button>
    </section>
  );
}
