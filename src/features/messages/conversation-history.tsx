import { useState } from "react";
import { useTranslator } from "@/lib/i18n/react";
import { api } from "@/lib/api/client";
export default function ConversationHistory({
  eventId,
  guestId,
  disabled,
  onImported,
}: {
  eventId: string;
  guestId: string;
  disabled: boolean;
  onImported: () => void;
}) {
  const i18n = useTranslator(),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  async function recover() {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await api<{ added: number }>(
        `/api/backend/events/${eventId}/conversations/${guestId}/history`,
        "POST",
        {},
        i18n,
      );
      setNotice(
        i18n(
          "Se añadieron {v0} mensajes. Solo se recuperan los que pueden identificarse con este evento.",
          { v0: String(result.added) },
        ),
      );
      onImported();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="inbox-history">
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => void recover()}
      >
        {busy
          ? i18n("Consultando WhatsApp…")
          : i18n("Recuperar mensajes recientes")}
      </button>
      <small>
        {i18n(
          "Consulta hasta 50 mensajes recientes posteriores al envío de esta invitación.",
        )}
      </small>
      {notice && <p role="status">{notice}</p>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
