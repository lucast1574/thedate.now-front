"use client";
import { useTranslator } from "@/lib/i18n/react";

import { useState } from "react";

export function useFeedback() {
  const i18n = useTranslator();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function run(action: () => Promise<void>, message = "") {
    setBusy(true);
    setError("");
    try {
      await action();
      if (message) setNotice(message);
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : i18n("No se pudo completar la acción"),
      );
      return false;
    } finally {
      setBusy(false);
    }
  }
  function clear() {
    setError("");
    setNotice("");
  }
  return { busy, error, notice, run, clear, setError, setNotice };
}
