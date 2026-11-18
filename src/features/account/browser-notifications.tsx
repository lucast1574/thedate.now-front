import { useState } from "react";
import { useTranslator } from "@/lib/i18n/react";
import Alert from "@/components/alert";
import {
  browserPushEnabled,
  connectBrowserPush,
  pushAvailable,
} from "@/features/messages/browser-push";

export default function BrowserNotifications({
  userId,
  wedding,
}: {
  userId: string;
  wedding: boolean;
}) {
  const i18n = useTranslator();
  const [enabled, setEnabled] = useState(() => browserPushEnabled(userId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function enable() {
    setError("");
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        if (permission === "denied")
          setError(
            i18n("Permite las notificaciones en los ajustes de este sitio."),
          );
        return;
      }
      await connectBrowserPush(userId, wedding);
      setEnabled(true);
    } catch {
      setError(
        i18n("No pudimos activar las notificaciones. Intenta de nuevo."),
      );
    } finally {
      setBusy(false);
    }
  }

  if (!pushAvailable()) return null;
  return (
    <section className="profile-panel profile-browser-notifications">
      <h2>{i18n("Notificaciones del navegador")}</h2>
      <p>{i18n("Recibe un aviso cuando un invitado te escriba.")}</p>
      {enabled ? (
        <p role="status">{i18n("Activadas en este navegador.")}</p>
      ) : (
        <button
          className="office-button"
          type="button"
          disabled={busy}
          onClick={() => void enable()}
        >
          {busy
            ? i18n("Activando notificaciones…")
            : i18n("Activar notificaciones")}
        </button>
      )}
      <Alert>{error}</Alert>
    </section>
  );
}
