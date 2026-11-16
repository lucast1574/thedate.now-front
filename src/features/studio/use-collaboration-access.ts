import { useTranslator } from "@/lib/i18n/react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/api/client";
type Access = {
  members: { id: string; name: string; email: string }[];
  pending: { id: string; email: string; delivery: string; expiresAt: string }[];
  limit: number;
  emailConfigured: boolean;
};
export function useCollaborationAccess(eventId: string) {
  const i18n = useTranslator();

  const [access, setAccess] = useState<Access | null>(null),
    [emails, setEmails] = useState(["", ""]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const load = useCallback(
    () =>
      api<Access>(
        `/api/backend/events/${eventId}/collaborators`,
        undefined,
        undefined,
        i18n,
      ).then((value) => {
        setAccess(value);
        return value;
      }),
    [eventId, i18n],
  );
  useEffect(() => {
    let active = true;
    api<Access>(
      `/api/backend/events/${eventId}/collaborators`,
      undefined,
      undefined,
      i18n,
    )
      .then((a) => {
        if (active) setAccess(a);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [eventId, i18n]);
  const remaining = access
    ? Math.max(0, access.limit - access.members.length - access.pending.length)
    : 0;
  async function invite(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    const candidates = emails
      .map((email, index) => ({ email: email.trim().toLowerCase(), index }))
      .filter((e) => e.email);
    if (
      !candidates.length ||
      candidates.length > remaining ||
      new Set(candidates.map((e) => e.email)).size !== candidates.length
    ) {
      setError(
        i18n("Escribe correos diferentes y respeta los accesos disponibles."),
      );
      return;
    }
    setBusy(true);
    let sent = 0;
    let deliveryIssue = false;
    try {
      for (const candidate of candidates) {
        const result = await api<{ delivery: string }>(
          `/api/backend/events/${eventId}/collaborators`,
          "POST",
          { email: candidate.email },
          i18n,
        );
        setEmails((current) =>
          current.map((email, index) =>
            index === candidate.index ? "" : email,
          ),
        );
        if (result.delivery === "sent") sent++;
        else {
          deliveryIssue = true;
          setNotice(
            i18n(
              "Hay una entrega pendiente o fallida. Revisa su estado antes de reenviar.",
            ),
          );
          break;
        }
      }
      if (sent && !deliveryIssue)
        setNotice(
          `${sent} ${sent === 1 ? i18n("invitación enviada") : i18n("invitaciones enviadas")}. Cada enlace dura siete días.`,
        );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      try {
        const latest = await load();
        const occupied = new Set(
          [...latest.members, ...latest.pending].map((item) =>
            item.email.toLowerCase(),
          ),
        );
        setEmails((current) => {
          const remaining = current.filter(
            (email) =>
              email.trim() && !occupied.has(email.trim().toLowerCase()),
          );
          return [remaining[0] || "", remaining[1] || ""];
        });
      } catch (e) {
        setError((e as Error).message);
      }
      setBusy(false);
    }
  }
  async function remove(id: string) {
    setBusy(true);
    setError("");
    try {
      await api(
        `/api/backend/events/${eventId}/collaborators/${id}`,
        "DELETE",
        undefined,
        i18n,
      );
      await load();
      setNotice(i18n("Acceso retirado."));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return {
    access,
    emails,
    setEmails,
    busy,
    error,
    notice,
    remaining,
    invite,
    remove,
  };
}
