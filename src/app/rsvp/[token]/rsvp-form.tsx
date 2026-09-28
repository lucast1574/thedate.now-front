"use client";
import { useEffect, useState } from "react";
type Details = { guestName: string; seats: number; response: string; eventTitle: string; kind: string; slug: string };
export default function RSVPForm({ token }: { token: string }) {
  const [details, setDetails] = useState<Details | null>(null);
  const [response, setResponse] = useState("going");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { fetch(`/api/rsvp/${token}`).then(async r => { if (!r.ok) throw new Error("Invitación no disponible"); return r.json(); }).then(setDetails).catch(e => setError(e.message)); }, [token]);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(""); const result = await fetch(`/api/rsvp/${token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ response, reason }) }).catch(() => null); if (!result?.ok) { const data = await result?.json().catch(() => ({})); setError(data?.error === "There are not enough seats available" ? "Ya no hay cupos disponibles. Comunícate con el organizador." : data?.error ?? "No pudimos guardar tu respuesta."); } else { setSaved(true); } setBusy(false); }
  return <main className="rsvp-page"><a className="office-brand" href="https://thedate.now">✳ &nbsp;the date<span>.</span></a><section className="rsvp-card"><p className="eyebrow">CONFIRMA TU ASISTENCIA</p><h1>{saved ? "Respuesta recibida." : details ? `Hola, ${details.guestName}.` : "Tu invitación"}</h1>{details && <p>Te invitaron a <strong>{details.eventTitle}</strong>. Tu invitación incluye {details.seats} {details.seats === 1 ? "cupo" : "cupos"}.</p>}{saved ? <p>Gracias por responder. Puedes volver a este enlace si necesitas cambiar tu respuesta.</p> : details && <form onSubmit={submit}><fieldset><legend>¿Podrás acompañarnos?</legend><label><input type="radio" name="response" value="going" checked={response === "going"} onChange={() => setResponse("going")} /> Sí, asistiré</label><label><input type="radio" name="response" value="not_going" checked={response === "not_going"} onChange={() => setResponse("not_going")} /> No podré asistir</label><label><input type="radio" name="response" value="maybe" checked={response === "maybe"} onChange={() => setResponse("maybe")} /> Tal vez</label></fieldset>{response === "maybe" && <label>Cuéntanos por qué estás en espera<textarea required minLength={3} value={reason} onChange={e => setReason(e.target.value)} /></label>}<button className="office-button" disabled={busy}>Enviar respuesta ↗</button></form>}{error && <p className="alert error">{error}</p>}</section></main>;
}
