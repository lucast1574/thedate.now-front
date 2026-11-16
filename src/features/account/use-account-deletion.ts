import { useTranslator } from "@/lib/i18n/react";
import { useRef, useState } from "react";
import { api } from "@/lib/api/client";

export function useAccountDeletion() {
  const i18n = useTranslator();

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  async function confirm() {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await api<{ status: "deleted" | "deleting" }>(
        "/api/backend/profile",
        "DELETE",
        undefined,
        i18n,
      );
      window.location.replace(`/delete-account?status=${result.status}`);
    } catch (cause) {
      setError((cause as Error).message);
      submitting.current = false;
      setBusy(false);
    }
  }
  return { open, setOpen, busy, error, confirm };
}
