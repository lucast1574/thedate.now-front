"use client";

import { FormEvent, useEffect, useState } from "react";
import Brand from "./brand";
import InvitationDesigner, { type DesignSection } from "./invitation-designer";

type Kind = "wedding" | "general";
type Event = { id: string; kind: Kind; slug: string; title: string; description: string; startAt: string; timeZone: string; organizer: string; location: string; isVirtual: boolean; mapUrl: string; virtualUrl: string; capacity: number; maybeHoldHours: number; template: string; accentColor: string; sections?: DesignSection[]; photoKeys: string[]; isDemo?: boolean; paymentStatus: string; publishedAt: string | null; updatedAt?: string };
type Guest = { id: string; name: string; phone: string; seats: number; response: string; maybeReason?: string; invitationUrl: string; sentAt?: string };
type User = { id: string; name: string; email: string; role: "admin" | "planner" | "organizer" | "couple" };

async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(path, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "No se pudo completar la acción");
  return data as T;
}

function host(kind: Kind, slug: string) { return `${slug}.${kind === "wedding" ? "save." : ""}thedate.now`; }
function browserTimeZone() { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; }
function localDateTime(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value.slice(0, 16) : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); }
function blankEvent(kind: Kind): Event { return { id: "", kind, slug: "", title: "", description: "", startAt: "", timeZone: browserTimeZone(), organizer: "", location: "", isVirtual: false, mapUrl: "", virtualUrl: "", capacity: 50, maybeHoldHours: 48, template: "classic", accentColor: "#ad7254", photoKeys: [], paymentStatus: "unpaid", publishedAt: null }; }
function normalizeEvent(event: Event): Event { return { ...event, startAt: localDateTime(event.startAt), timeZone: event.timeZone || browserTimeZone(), organizer: event.organizer ?? "", location: event.location ?? "", isVirtual: event.isVirtual ?? false, mapUrl: event.mapUrl ?? "", virtualUrl: event.virtualUrl ?? "" }; }
function eventPayload(event: Event) { const virtual = event.kind === "general" && event.isVirtual; return { kind: event.kind, slug: event.slug, title: event.title, description: event.description, startAt: new Date(event.startAt).toISOString(), timeZone: event.timeZone || browserTimeZone(), organizer: event.organizer, location: virtual ? "En línea" : event.location, isVirtual: virtual, mapUrl: virtual ? "" : event.mapUrl, virtualUrl: virtual ? event.virtualUrl : "", capacity: event.capacity, maybeHoldHours: event.maybeHoldHours, template: event.template, accentColor: event.accentColor }; }

export default function Backoffice({ portal, googleEnabled = false, paymentsEnabled = false }: { portal: Kind; googleEnabled?: boolean; paymentsEnabled?: boolean }) {
  const wedding = portal === "wedding";
  const otherPortal = wedding ? "https://crea.thedate.now" : "https://studio.save.thedate.now";
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: (wedding ? "planner" : "organizer") as "planner" | "organizer" });
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);
  const [draft, setDraft] = useState<Event>(blankEvent(portal));
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guest, setGuest] = useState({ name: "", phone: "", seats: 1 });
  const [coupleAccount, setCoupleAccount] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [resolvingMap, setResolvingMap] = useState(false);
  const [mapStatus, setMapStatus] = useState("");

  async function refreshEvents() { const list = (await api<Event[]>("/api/backend/events")).filter(event => event.kind === portal); setEvents(list); return list; }
  async function select(event: Event) { setSelected(event); setDraft(normalizeEvent(event)); setGuests(event.isDemo || user?.role === "couple" ? [] : await api<Guest[]>(`/api/backend/events/${event.id}/guests`)); setError(""); setNotice(""); setMapStatus(""); }
  useEffect(() => {
    const url = draft.mapUrl.trim();
    if (draft.isVirtual || !url || url === selected?.mapUrl) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      setResolvingMap(true); setMapStatus("Buscando la dirección del enlace…");
      try {
        const result = await api<{ address: string }>("/api/backend/maps/resolve", "POST", { url });
        if (active) { setDraft(current => current.mapUrl.trim() === url && !current.isVirtual && !current.location.trim() ? { ...current, location: result.address } : current); setMapStatus("Dirección encontrada. Revísala antes de guardar. © OpenStreetMap contributors"); }
      } catch (err) { if (active) setMapStatus((err as Error).message); }
      finally { if (active) setResolvingMap(false); }
    }, 650);
    return () => { active = false; window.clearTimeout(timer); };
  }, [draft.mapUrl, draft.isVirtual, selected?.mapUrl]);
  useEffect(() => { api<User>("/api/session").then(async current => {
    if (wedding ? current.role !== "organizer" : current.role === "organizer" || current.role === "admin") { setUser(current); setDraft({ ...blankEvent(portal), organizer: current.name }); const list = await refreshEvents(); const demo = list.find(item => item.isDemo); if (demo) { setSelected(demo); setDraft(normalizeEvent(demo)); } }
    else { await api("/api/session", "DELETE"); setError(`Esta cuenta pertenece al otro espacio. Entra desde ${otherPortal}.`); }
  }).catch(() => {}); }, [wedding, otherPortal]);

  async function signIn(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try { const result = await api<{ user: User }>("/api/session", "POST", { ...form, role: wedding ? "planner" : "organizer", action: mode }); if (wedding ? result.user.role === "organizer" : result.user.role !== "organizer" && result.user.role !== "admin") { await api("/api/session", "DELETE"); throw new Error(`Esta cuenta pertenece al otro espacio. Entra desde ${otherPortal}.`); } setUser(result.user); setDraft({ ...blankEvent(portal), organizer: result.user.name }); const list = await refreshEvents(); const demo = list.find(item => item.isDemo); if (demo) { setSelected(demo); setDraft(normalizeEvent(demo)); } setNotice(`Bienvenido, ${result.user.name}.`); }
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
  async function sendInvitations() {
    if (!selected) return; setBusy(true); setError("");
    try { const result = await api<{ sent: number; failed: number; remaining: number }>(`/api/backend/events/${selected.id}/send-invitations`, "POST"); setGuests(await api<Guest[]>(`/api/backend/events/${selected.id}/guests`)); setNotice(`${result.sent} invitaciones enviadas${result.failed ? `, ${result.failed} fallidas` : ""}.`); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function inviteCouple(e: FormEvent) {
    e.preventDefault(); if (!selected) return; setBusy(true); setError("");
    try { await api(`/api/backend/events/${selected.id}/couple-accounts`, "POST", coupleAccount); setCoupleAccount({ name: "", email: "", password: "" }); setNotice("Cuenta creada. Comparte el correo y la contraseña con la pareja por un canal seguro."); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  const kind: Kind = portal;
  const occupied = guests.filter(x => x.response === "going" || x.response === "maybe").reduce((sum, x) => sum + x.seats, 0);

  return <main className={`office ${wedding ? "office-wedding" : "office-general"}`}><header className="office-header"><a className="office-brand" href={wedding ? "https://save.thedate.now" : "https://thedate.now"}><Brand wedding={wedding} /></a><div>{user ? <><span>{user.name}</span><button onClick={async () => { await api("/api/session", "DELETE"); setUser(null); setEvents([]); setSelected(null); }}>Salir</button></> : <span>{wedding ? "Estudio de bodas" : "Mi espacio de eventos"}</span>}</div></header>
    {!user ? <section className="auth-panel"><p className="office-kicker">{wedding ? "ESTUDIO DE BODAS" : "MI ESPACIO DE EVENTOS"}</p><h1>{mode === "login" ? "Bienvenido de nuevo." : wedding ? "Creemos algo inolvidable." : "Que empiece el plan."}</h1><p>{wedding ? "Organiza cada boda con la pareja, sus invitados y todos los detalles en un mismo lugar." : "Tu celebración, tus invitados y cada detalle en un solo lugar."}</p><form onSubmit={signIn}>{mode === "register" && <label>Nombre<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>}<label>Correo<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label><label>Contraseña<input required type="password" minLength={mode === "register" ? 10 : undefined} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label><button className="office-button" disabled={busy}>{mode === "login" ? "Entrar" : wedding ? "Crear cuenta de planner" : "Crear mi cuenta"} ↗</button></form>{googleEnabled && <a className="google-button" href="/api/auth/google/start">Continuar con Google</a>}<button className="plain-button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "¿Primera vez? Crea tu cuenta" : "Ya tengo una cuenta"}</button><p className="portal-switch">{wedding ? "¿Organizas otro tipo de evento?" : "¿Planeas bodas?"} <a href={otherPortal}>{wedding ? "Ir a The Date" : "Ir al Estudio de bodas"} ↗</a></p>{error && <p className="alert error">{error}</p>}</section>
      : <div className="office-body"><aside className="office-sidebar"><p className="office-kicker">TUS EVENTOS</p>{user.role !== "couple" && <button className="new-event" onClick={() => { setSelected(null); setDraft({ ...blankEvent(kind), organizer: user.name }); setGuests([]); setError(""); setMapStatus(""); }}>＋ Crear evento</button>}<div className="event-list">{events.map(event => <button key={event.id} className={selected?.id === event.id ? "active" : ""} onClick={() => select(event)}><strong>{event.title}</strong><small>{event.isDemo ? "Demo · marca de agua" : event.kind === "wedding" ? "Boda" : "Evento"} · {event.publishedAt ? "Publicado" : event.paymentStatus === "paid" ? "Listo para publicar" : "Borrador"}</small></button>)}</div></aside><section className="office-main"><p className="office-kicker">{selected ? "EDITAR EVENTO" : "NUEVO EVENTO"}</p><h1>{selected?.isDemo ? "Tu invitación de muestra" : selected ? selected.title : "Un día para recordar."}</h1><p className="office-lead">{selected ? "Ajusta los detalles y lleva el control de tus invitados." : "Elige una dirección única para compartir con todos."}</p>{notice && <p className="alert success">{notice}</p>}{error && <p className="alert error">{error}</p>}
        {user.role !== "couple" && !selected?.isDemo && <form className="event-form" onSubmit={selected ? save : create}>
          <div className="form-grid">
            <label>Nombre del evento<input required value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder={kind === "wedding" ? "Álvaro y Laura" : "Cumpleaños de Lucas"} /></label>
            <label>Dirección de la invitación<input required disabled={!!selected} pattern="[a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9]" value={draft.slug} onChange={e => setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} placeholder={kind === "wedding" ? "alvaroylaura" : "cumpleanoslucas"} /><small>{draft.slug ? host(draft.kind, draft.slug) : kind === "wedding" ? "tunombre.save.thedate.now" : "tunombre.thedate.now"}</small></label>
            <label>Fecha y hora<input required type="datetime-local" value={draft.startAt.slice(0, 16)} onChange={e => setDraft({ ...draft, startAt: e.target.value, timeZone: browserTimeZone() })} /><small>Hora local del organizador.</small></label>
            <label>Organiza<input required value={draft.organizer} onChange={e => setDraft({ ...draft, organizer: e.target.value })} placeholder={kind === "wedding" ? "La pareja o wedding planner" : "Tu nombre u organización"} /></label>
          </div>
          {!wedding && <fieldset className="event-mode"><legend>Modalidad</legend><label><input type="radio" name="event-mode" checked={!draft.isVirtual} onChange={() => { setDraft({ ...draft, isVirtual: false, virtualUrl: "", location: "" }); setMapStatus(""); }} /> Presencial</label><label><input type="radio" name="event-mode" checked={draft.isVirtual} onChange={() => { setDraft({ ...draft, isVirtual: true, mapUrl: "", location: "" }); setMapStatus(""); }} /> Virtual</label></fieldset>}
          {draft.isVirtual ? <label>Enlace para unirse<input required type="url" value={draft.virtualUrl} onChange={e => setDraft({ ...draft, virtualUrl: e.target.value })} placeholder="https://meet.google.com/..." /><small>Los invitados verán este enlace en su invitación.</small></label> : <div className="form-grid"><label>Enlace de Google Maps<input required type="url" value={draft.mapUrl} onChange={e => { setDraft({ ...draft, mapUrl: e.target.value, location: "" }); setMapStatus(""); }} placeholder="https://maps.app.goo.gl/..." /><small>Pega el enlace y buscaremos la dirección automáticamente.</small></label><label>Dirección o nombre del lugar<input required value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} placeholder="Se completará al pegar el enlace" /><small>Puedes corregirla si hace falta.</small></label></div>}
          {!draft.isVirtual && mapStatus && <p className={`map-status ${resolvingMap ? "loading" : ""}`}>{mapStatus.includes("OpenStreetMap") ? <>{mapStatus.replace(" © OpenStreetMap contributors", "")} <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a></> : mapStatus}</p>}
          <div className="form-grid"><label>Cupo total<input required type="number" min="1" value={draft.capacity} onChange={e => setDraft({ ...draft, capacity: Number(e.target.value) })} /></label><label>Reserva temporal para «Tal vez» (horas)<input required type="number" min="1" max="168" value={draft.maybeHoldHours} onChange={e => setDraft({ ...draft, maybeHoldHours: Number(e.target.value) })} /></label></div>
          <label>Mensaje de la invitación<textarea rows={4} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} placeholder="Queremos celebrar este momento contigo..." /></label>
          <div className="form-grid"><label>Estilo<select value={draft.template} onChange={e => setDraft({ ...draft, template: e.target.value })}><option value="classic">Clásico editorial</option><option value="modern">Moderno</option></select></label><label>Color de acento<input type="color" value={draft.accentColor} onChange={e => setDraft({ ...draft, accentColor: e.target.value })} /></label></div>
          <button className="office-button" disabled={busy}>{selected ? "Guardar cambios" : "Crear evento"} ↗</button>
        </form>}
        {selected && <InvitationDesigner key={`${selected.id}-${selected.updatedAt}`} event={selected} onSaved={async () => { const list = await refreshEvents(); const updated = list.find(x => x.id === selected.id); if (updated) { setSelected(updated); setDraft(normalizeEvent(updated)); } }} />}
        {selected?.kind === "wedding" && selected.paymentStatus === "paid" && (user.role === "planner" || user.role === "admin") && <section className="couple-access"><div className="office-divider" /><p className="office-kicker">ACCESO PARA LA PAREJA</p><h2>Planeen juntos.</h2><p>Crea hasta dos cuentas para la pareja. La contraseña solo se muestra mientras la escribes.</p><form onSubmit={inviteCouple}><input required placeholder="Nombre" value={coupleAccount.name} onChange={e => setCoupleAccount({ ...coupleAccount, name: e.target.value })} /><input type="email" required placeholder="Correo de la pareja" value={coupleAccount.email} onChange={e => setCoupleAccount({ ...coupleAccount, email: e.target.value })} /><input type="password" required minLength={10} placeholder="Contraseña (mínimo 10 caracteres)" value={coupleAccount.password} onChange={e => setCoupleAccount({ ...coupleAccount, password: e.target.value })} /><button className="office-button" disabled={busy}>Crear cuenta</button></form></section>}
        {selected && !selected.isDemo && user.role !== "couple" && <><div className="office-divider" /><div className="action-row"><div><p className="office-kicker">PUBLICACIÓN</p><h2>Comparte tu invitación</h2><p>{host(selected.kind, selected.slug)}</p></div><div>{selected.paymentStatus !== "paid" ? <button className="office-button" disabled={busy || !paymentsEnabled} onClick={checkout}>{paymentsEnabled ? "Pagar" : "Pagos en preparación"} · {selected.kind === "wedding" ? "USD 25" : "USD 5"}</button> : selected.publishedAt ? <a className="office-button" href={`https://${host(selected.kind, selected.slug)}`} target="_blank" rel="noopener noreferrer">Ver invitación ↗</a> : <button className="office-button" disabled={busy} onClick={publish}>Publicar invitación ↗</button>}</div></div><div className="office-divider" /><div className="action-row"><div><p className="office-kicker">LISTA DE INVITADOS</p><h2>Confirmaciones</h2></div><div className="seat-stat"><strong>{occupied}</strong><span>/ {selected.capacity} cupos reservados</span></div></div>{selected.publishedAt && <button className="send-button" disabled={busy || guests.every(g => !!g.sentAt)} onClick={sendInvitations}>Enviar invitaciones por WhatsApp ↗</button>}<p className="guest-hint">Cada persona recibe su propio enlace para responder. Puedes copiarlo antes de enviar WhatsApp.</p><form className="guest-form" onSubmit={addGuest}><input required placeholder="Nombre" value={guest.name} onChange={e => setGuest({ ...guest, name: e.target.value })} /><input required placeholder="WhatsApp +57..." value={guest.phone} onChange={e => setGuest({ ...guest, phone: e.target.value })} /><input required type="number" min="1" max="20" value={guest.seats} onChange={e => setGuest({ ...guest, seats: Number(e.target.value) })} /><button className="office-button" disabled={busy}>Agregar</button></form><div className="guest-list">{guests.length === 0 ? <p>Aún no hay invitados.</p> : guests.map(g => <div key={g.id}><strong>{g.name}</strong><span>{g.phone}</span><span>{g.seats} {g.seats === 1 ? "cupo" : "cupos"}</span><a href={g.invitationUrl} target="_blank" rel="noopener noreferrer">Enlace ↗</a><small>{g.response === "going" ? "Confirmado" : g.response === "not_going" ? "No asistirá" : g.response === "maybe" ? "En espera" : "Pendiente"}</small></div>)}</div></>}
      </section></div>}</main>;
}
