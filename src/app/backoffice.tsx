"use client";

import { FormEvent, useEffect, useState } from "react";

type Kind = "wedding" | "general";
type Event = { id: string; kind: Kind; slug: string; title: string; description: string; startAt: string; location: string; capacity: number; maybeHoldHours: number; template: string; accentColor: string; photoKeys: string[]; paymentStatus: string; publishedAt: string | null };
type Guest = { id: string; name: string; phone: string; seats: number; response: string; maybeReason?: string; invitationUrl: string; sentAt?: string };
type User = { id: string; name: string; email: string; role: "planner" | "organizer" | "couple" };

async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(path, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "No se pudo completar la acción");
  return data as T;
}

function host(kind: Kind, slug: string) { return `${slug}.${kind === "wedding" ? "save." : ""}thedate.now`; }
function blankEvent(kind: Kind): Event { return { id: "", kind, slug: "", title: "", description: "", startAt: "", location: "", capacity: 50, maybeHoldHours: 48, template: "classic", accentColor: "#ad7254", photoKeys: [], paymentStatus: "unpaid", publishedAt: null }; }
function eventPayload(event: Event) { return { kind: event.kind, slug: event.slug, title: event.title, description: event.description, startAt: new Date(event.startAt).toISOString(), location: event.location, capacity: event.capacity, maybeHoldHours: event.maybeHoldHours, template: event.template, accentColor: event.accentColor }; }

export default function Backoffice() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "organizer" as "planner" | "organizer" | "couple" });
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);
  const [draft, setDraft] = useState<Event>(blankEvent("general"));
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guest, setGuest] = useState({ name: "", phone: "", seats: 1 });
  const [coupleEmail, setCoupleEmail] = useState("");
  const [coupleLink, setCoupleLink] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function refreshEvents() { const list = await api<Event[]>("/api/backend/events"); setEvents(list); return list; }
  async function select(event: Event) { setSelected(event); setDraft(event); setGuests(await api<Guest[]>(`/api/backend/events/${event.id}/guests`)); setError(""); setNotice(""); }
  useEffect(() => { api<User>("/api/session").then(async current => { setUser(current); await refreshEvents(); }).catch(() => {}); }, []);

  async function signIn(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try { const result = await api<{ user: User }>("/api/session", "POST", { ...form, action: mode }); setUser(result.user); await refreshEvents(); setNotice(`Bienvenido, ${result.user.name}.`); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function create(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try { const created = await api<Event>("/api/backend/events", "POST", eventPayload(draft)); await refreshEvents(); await select(created); setNotice("Evento creado. La invitación se publicará después del pago de prueba."); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function save(e: FormEvent) {
    e.preventDefault(); if (!selected) return; setBusy(true); setError("");
    try { await api(`/api/backend/events/${selected.id}`, "PATCH", eventPayload(draft)); const list = await refreshEvents(); const updated = list.find(x => x.id === selected.id); if (updated) setSelected(updated); setNotice("Cambios guardados."); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function addGuest(e: FormEvent) {
    e.preventDefault(); if (!selected) return; setBusy(true); setError("");
    try { await api(`/api/backend/events/${selected.id}/guests`, "POST", guest); setGuests(await api<Guest[]>(`/api/backend/events/${selected.id}/guests`)); setGuest({ name: "", phone: "", seats: 1 }); setNotice("Invitado agregado."); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function checkout() {
    if (!selected) return; setBusy(true); setError("");
    try { const result = await api<{ url: string }>(`/api/backend/events/${selected.id}/checkout`, "POST"); window.location.href = result.url; }
    catch (err) { setError((err as Error).message); setBusy(false); }
  }
  async function publish() {
    if (!selected) return; setBusy(true); setError("");
    try { await api(`/api/backend/events/${selected.id}/publish`, "POST"); const list = await refreshEvents(); const updated = list.find(x => x.id === selected.id); if (updated) await select(updated); setNotice("La invitación ya está publicada."); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function uploadPhoto(file: File) {
    if (!selected) return;
    setBusy(true); setError("");
    try { const data = new FormData(); data.append("photo", file); const result = await fetch(`/api/photos/${selected.id}`, { method: "POST", body: data }); const body = await result.json(); if (!result.ok) throw new Error(body.error ?? "No se pudo subir la foto"); const list = await refreshEvents(); const updated = list.find(x => x.id === selected.id); if (updated) { setSelected(updated); setDraft(updated); } setNotice("Foto agregada a la invitación."); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function sendInvitations() {
    if (!selected) return; setBusy(true); setError("");
    try { const result = await api<{ sent: number; failed: number; remaining: number }>(`/api/backend/events/${selected.id}/send-invitations`, "POST"); setGuests(await api<Guest[]>(`/api/backend/events/${selected.id}/guests`)); setNotice(`${result.sent} invitaciones enviadas${result.failed ? `, ${result.failed} fallidas` : ""}.`); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function inviteCouple(e: FormEvent) {
    e.preventDefault(); if (!selected) return; setBusy(true); setError("");
    try { const result = await api<{ url: string }>(`/api/backend/events/${selected.id}/couple-invitations`, "POST", { email: coupleEmail }); setCoupleLink(result.url); setCoupleEmail(""); setNotice("Acceso creado. Comparte el enlace con la persona invitada."); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  const kind: Kind = user?.role === "planner" ? "wedding" : "general";
  const occupied = guests.filter(x => x.response === "going" || x.response === "maybe").reduce((sum, x) => sum + x.seats, 0);

  return <main className="office"><header className="office-header"><a className="office-brand" href="https://thedate.now">✳ &nbsp;the date<span>.</span></a><div>{user ? <><span>{user.name}</span><button onClick={async () => { await api("/api/session", "DELETE"); setUser(null); setEvents([]); setSelected(null); }}>Salir</button></> : <span>Backoffice</span>}</div></header>
    {!user ? <section className="auth-panel"><p className="office-kicker">TU ESPACIO</p><h1>{mode === "login" ? "Bienvenido de nuevo." : "Empieza aquí."}</h1><p>Tu celebración, tus invitados y cada detalle en un solo lugar.</p><form onSubmit={signIn}>{mode === "register" && <label>Nombre<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>}<label>Correo<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label><label>Contraseña<input required type="password" minLength={mode === "register" ? 10 : undefined} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>{mode === "register" && <label>Quiero organizar<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as "planner" | "organizer" })}><option value="organizer">Cumpleaños y otros eventos</option><option value="planner">Bodas como wedding planner</option><option value="couple">Tengo una invitación de mi wedding planner</option></select></label>}<button className="office-button" disabled={busy}>{mode === "login" ? "Entrar" : "Crear cuenta"} ↗</button></form><button className="plain-button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "¿Primera vez? Crea tu cuenta" : "Ya tengo una cuenta"}</button>{error && <p className="alert error">{error}</p>}</section>
      : <div className="office-body"><aside className="office-sidebar"><p className="office-kicker">TUS EVENTOS</p>{user.role !== "couple" && <button className="new-event" onClick={() => { setSelected(null); setDraft(blankEvent(kind)); setGuests([]); setError(""); }}>＋ Crear evento</button>}<div className="event-list">{events.map(event => <button key={event.id} className={selected?.id === event.id ? "active" : ""} onClick={() => select(event)}><strong>{event.title}</strong><small>{event.kind === "wedding" ? "Boda" : "Evento"} · {event.publishedAt ? "Publicado" : event.paymentStatus === "paid" ? "Listo para publicar" : "Borrador"}</small></button>)}</div></aside><section className="office-main"><p className="office-kicker">{selected ? "EDITAR EVENTO" : "NUEVO EVENTO"}</p><h1>{selected ? selected.title : "Un día para recordar."}</h1><p className="office-lead">{selected ? "Ajusta los detalles y lleva el control de tus invitados." : "Elige una dirección única para compartir con todos."}</p>{notice && <p className="alert success">{notice}</p>}{error && <p className="alert error">{error}</p>}
        <form className="event-form" onSubmit={selected ? save : create}><div className="form-grid"><label>Nombre del evento<input required value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder={kind === "wedding" ? "Álvaro y Laura" : "Cumpleaños de Lucas"} /></label><label>Dirección de la invitación<input required disabled={!!selected} pattern="[a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9]" value={draft.slug} onChange={e => setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} placeholder={kind === "wedding" ? "alvaroylaura" : "cumpleanoslucas"} /><small>{draft.slug ? host(draft.kind, draft.slug) : kind === "wedding" ? "tunombre.save.thedate.now" : "tunombre.thedate.now"}</small></label><label>Fecha y hora<input required type="datetime-local" value={draft.startAt.slice(0, 16)} onChange={e => setDraft({ ...draft, startAt: e.target.value })} /></label><label>Lugar<input required value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} placeholder="Nombre del lugar y dirección" /></label><label>Cupo total<input required type="number" min="1" value={draft.capacity} onChange={e => setDraft({ ...draft, capacity: Number(e.target.value) })} /></label><label>Reserva temporal para «Tal vez» (horas)<input required type="number" min="1" max="168" value={draft.maybeHoldHours} onChange={e => setDraft({ ...draft, maybeHoldHours: Number(e.target.value) })} /></label></div><label>Mensaje de la invitación<textarea rows={4} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="Queremos celebrar este momento contigo..." /></label><div className="form-grid"><label>Estilo<select value={draft.template} onChange={e => setDraft({ ...draft, template: e.target.value })}><option value="classic">Clásico editorial</option><option value="modern">Moderno</option></select></label><label>Color de acento<input type="color" value={draft.accentColor} onChange={e => setDraft({ ...draft, accentColor: e.target.value })} /></label></div><button className="office-button" disabled={busy}>{selected ? "Guardar cambios" : "Crear evento"} ↗</button></form>
        {selected?.kind === "wedding" && selected.paymentStatus === "paid" && user.role === "planner" && <section className="couple-access"><div className="office-divider" /><p className="office-kicker">ACCESO PARA LA PAREJA</p><h2>Planeen juntos.</h2><p>Comparte hasta dos accesos con la pareja. Cada persona crea su propia cuenta.</p><form onSubmit={inviteCouple}><input type="email" required placeholder="Correo de uno de los novios" value={coupleEmail} onChange={e => setCoupleEmail(e.target.value)} /><button className="office-button" disabled={busy}>Crear acceso</button></form>{coupleLink && <p className="couple-link"><a href={coupleLink} target="_blank" rel="noopener noreferrer">{coupleLink}</a></p>}</section>}
        {selected && <section className="photo-editor"><div className="office-divider" /><p className="office-kicker">FOTOS DEL EVENTO</p><h2>Hazla tuya.</h2><p>Agrega fotos para que la invitación cuente la historia de este día.</p><label className="photo-upload">＋ Subir foto<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => { const file = e.target.files?.[0]; if (file) uploadPhoto(file); }} /></label><div className="photo-grid">{selected.photoKeys?.map(key => <img key={key} src={`https://api.thedate.now/public/events/${selected.kind}/${selected.slug}/photos/${encodeURIComponent(key)}`} alt="Foto del evento" />)}</div></section>}
        {selected && <><div className="office-divider" /><div className="action-row"><div><p className="office-kicker">PUBLICACIÓN</p><h2>Comparte tu invitación</h2><p>{host(selected.kind, selected.slug)}</p></div><div>{selected.paymentStatus !== "paid" ? <button className="office-button" disabled={busy} onClick={checkout}>Pagar evento (modo prueba) ↗</button> : selected.publishedAt ? <a className="office-button" href={`https://${host(selected.kind, selected.slug)}`} target="_blank" rel="noopener noreferrer">Ver invitación ↗</a> : <button className="office-button" disabled={busy} onClick={publish}>Publicar invitación ↗</button>}</div></div><div className="office-divider" /><div className="action-row"><div><p className="office-kicker">LISTA DE INVITADOS</p><h2>Confirmaciones</h2></div><div className="seat-stat"><strong>{occupied}</strong><span>/ {selected.capacity} cupos reservados</span></div></div>{selected.publishedAt && <button className="send-button" disabled={busy || guests.every(g => !!g.sentAt)} onClick={sendInvitations}>Enviar invitaciones por WhatsApp ↗</button>}<p className="guest-hint">Cada persona recibe su propio enlace para responder. Puedes copiarlo antes de enviar WhatsApp.</p><form className="guest-form" onSubmit={addGuest}><input required placeholder="Nombre" value={guest.name} onChange={e => setGuest({ ...guest, name: e.target.value })} /><input required placeholder="WhatsApp +57..." value={guest.phone} onChange={e => setGuest({ ...guest, phone: e.target.value })} /><input required type="number" min="1" max="20" value={guest.seats} onChange={e => setGuest({ ...guest, seats: Number(e.target.value) })} /><button className="office-button" disabled={busy}>Agregar</button></form><div className="guest-list">{guests.length === 0 ? <p>Aún no hay invitados.</p> : guests.map(g => <div key={g.id}><strong>{g.name}</strong><span>{g.phone}</span><span>{g.seats} {g.seats === 1 ? "cupo" : "cupos"}</span><a href={g.invitationUrl} target="_blank" rel="noopener noreferrer">Enlace ↗</a><small>{g.response === "going" ? "Confirmado" : g.response === "not_going" ? "No asistirá" : g.response === "maybe" ? "En espera" : "Pendiente"}</small></div>)}</div></>}
      </section></div>}</main>;
}
