"use client";
import { useEffect, useState, type FormEvent } from "react";
import type { Person } from "@/lib/events/seating";
import type { RSVPDetails } from "./types";

export function useRSVP(token: string) {
  const [details, setDetails] = useState<RSVPDetails | null>(null);
  const [response, setResponse] = useState("going");
  const [companions, setCompanions] = useState<Person[]>([]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    fetch(`/api/rsvp/${token}`)
      .then(async (result) => {
        if (!result.ok) throw new Error("Invitación no disponible");
        return result.json();
      })
      .then((data) => {
        if (active) {
          setDetails(data);
          setCompanions(data.companions || []);
          if (["going", "not_going", "maybe"].includes(data.response))
            setResponse(data.response);
          setReason(data.maybeReason ?? "");
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [token]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await fetch(`/api/rsvp/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response,
        reason,
        ...(response !== "not_going" ? { companions } : {}),
      }),
    }).catch(() => null);
    if (!result?.ok) {
      const data = await result?.json().catch(() => ({}));
      setError(
        data?.error === "There are not enough seats available"
          ? "Ya no hay cupos disponibles. Comunícate con el organizador."
          : (data?.error ?? "No pudimos guardar tu respuesta."),
      );
    } else setSaved(true);
    setBusy(false);
  }
  return {
    details,
    companions,
    setCompanions,
    response,
    setResponse,
    reason,
    setReason,
    error,
    saved,
    busy,
    submit,
  };
}
