"use client";
import { useEffect, useState } from "react";
type Invite = { email: string; eventTitle: string };
export default function Join({ token }: { token: string }) {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);
  useEffect(() => { fetch(`/api/join/${token}`).then(async r => { if (!r.ok) throw new Error("Esta invitación ya no está disponible."); return r.json(); }).then(setInvite).catch(e => setMessage(e.message)); }, [token]);
  async function accept() { const result = await fetch(`/api/join/${token}`, { method: "POST" }); const data = await result.json(); if (!result.ok) setMessage(data.error === "Sign in required" ? "Entra o crea una cuenta con el correo invitado, luego vuelve a este enlace." : data.error ?? "No se pudo aceptar la invitación."); else { setAccepted(true); setMessage("Ya tienes acceso a la boda en tu panel."); } }
  return <main className="rsvp-page"><a className="office-brand" href="https://thedate.now">✳ &nbsp;the date<span>.</span></a><section className="rsvp-card"><p className="eyebrow">ACCESO PARA LA PAREJA</p><h1>{accepted ? "Ya eres parte." : "Su historia, en sus manos."}</h1>{invite && <p>Te invitaron a gestionar <strong>{invite.eventTitle}</strong> desde la cuenta <strong>{invite.email}</strong>.</p>}{!accepted && invite && <button className="office-button" onClick={accept}>Aceptar invitación ↗</button>}{message && <p className={accepted ? "alert success" : "alert error"}>{message}</p>}<a className="text-link" href="https://studio.save.thedate.now">Ir al Estudio de bodas →</a></section></main>;
}
