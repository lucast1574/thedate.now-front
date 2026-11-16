import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <section className="professional-upgrade">
      <Icon name="lucide:users-round" />
      <div>
        <strong>
          {wedding
            ? i18n("¿Organizas bodas para otras parejas?")
            : i18n("¿Creas eventos para otras personas?")}
        </strong>
        <p>
          {i18n(
            "Activa gratis tu espacio profesional y comparte cada celebración con sus protagonistas.",
          )}
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
              await api<User>(
                "/api/backend/profile/professional",
                "POST",
                undefined,
                i18n,
              ),
            );
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy
          ? i18n("Activando…")
          : wedding
            ? i18n("Soy wedding planner")
            : i18n("Soy organizador de eventos")}
        <Icon name="arrow" />
      </button>
    </section>
  );
}
