"use client";
import { useState } from "react";

export function useFeedback() {
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
        err instanceof Error ? err.message : "No se pudo completar la acción",
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
