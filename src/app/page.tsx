import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Backoffice from "./backoffice";
import Brand, { WeddingMark } from "./brand";

type Kind = "wedding" | "general";
type PublicEvent = { id: string; kind: Kind; slug: string; title: string; description: string; startAt: string; timeZone: string; organizer: string; location: string; isVirtual: boolean; mapUrl: string; virtualUrl: string; accentColor: string; photoKeys: string[] };

export function invitationFromHost(raw: string): { kind: Kind; slug: string } | null {
  const host = raw.toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
  const wedding = host.match(/^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\.save\.thedate\.now$/);
  if (wedding) return { kind: "wedding", slug: wedding[1] };
  const general = host.match(/^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\.thedate\.now$/);
  if (general && !["api", "app", "admin", "backoffice", "save", "www", "mail", "static", "assets", "support"].includes(general[1])) return { kind: "general", slug: general[1] };
  return null;
}

async function findEvent(kind: Kind, slug: string): Promise<PublicEvent | null> {
  const api = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "https://api.thedate.now";
  try { const result = await fetch(`${api}/public/events/${kind}/${slug}`, { cache: "no-store" }); return result.ok ? await result.json() as PublicEvent : null; }
  catch { return null; }
}

function Landing({ wedding }: { wedding: boolean }) {
  if (!wedding) return <GeneralLanding />;
  return <main className={`site ${wedding ? "wedding" : "general"}`}>
    <header className="topbar shell"><a href="https://save.thedate.now"><Brand wedding /></a><nav><a href="#como-funciona">Cómo funciona</a><a href="https://thedate.now">Otros eventos</a><a className="nav-action" href="https://studio.save.thedate.now">Estudio ↗</a></nav></header>
    <section className="hero shell"><div className="wedding-hero-copy"><p className="eyebrow">✦ &nbsp;SAVE THE DATE · BODAS</p><h1>Una fecha.<br /><em>Para siempre.</em></h1><p className="hero-copy">Invitaciones de boda que cuentan su historia. Confirmaciones por WhatsApp, aforo claro y cada detalle en un solo lugar.</p><div className="hero-actions"><a className="button" href="https://studio.save.thedate.now">Crear nuestra invitación &nbsp; ↗</a><a className="text-link" href="#como-funciona">Descubre cómo funciona →</a></div></div><div className="wedding-hero-art" aria-label="Ejemplo decorativo de una invitación de boda"><div className="wedding-paper wedding-paper-back" /><div className="wedding-paper wedding-paper-front"><div className="wedding-paper-border"><span className="wedding-paper-kicker">UNA HISTORIA PARA CELEBRAR</span><WeddingMark className="wedding-paper-mark" /><span className="wedding-paper-overline">JUNTOS PARA SIEMPRE</span><strong>Sofía <i>&</i> Mateo</strong><span className="wedding-paper-rule" /><span className="wedding-paper-date">21 · JUNIO · 2027</span><span className="wedding-paper-foot">EL COMIENZO DE ALGO HERMOSO</span></div></div><div className="wedding-hero-note">✧ Un enlace único para cada celebración</div></div></section>
    <section className="features" id="como-funciona"><div className="shell features-layout"><div><p className="eyebrow">01 / LA EXPERIENCIA</p><h2>Invitar debería ser<br /><em>parte de la emoción.</em></h2></div><div className="cards"><article><span className="card-symbol">↗</span><small>01</small><h3>Diseña a tu manera</h3><p>Elige una plantilla, agrega fotos y cuenta los detalles de tu día con tu propia voz.</p></article><article><span className="card-symbol">◌</span><small>02</small><h3>Cada invitado, al día</h3><p>Invita por WhatsApp y sigue las respuestas y los cupos desde un solo panel.</p></article><article><span className="card-symbol">✳</span><small>03</small><h3>Un lugar para recordar</h3><p>Comparte una dirección tan especial como el evento: {wedding ? "su-historia.save.thedate.now" : "tu-fiesta.thedate.now"}.</p></article></div></div></section>
    <footer className="footer shell"><Brand wedding /><span>Hecho para los momentos que se quedan.</span><a href="https://studio.save.thedate.now">Abrir estudio ↗</a></footer>
  </main>;
}

function GeneralLanding() {
  return <main className="party-site">
    <header className="party-header party-shell"><a href="https://thedate.now" aria-label="The Date, inicio"><Brand /></a><nav><a href="#ideas">Para cada ocasión</a><a href="#como-funciona">Cómo funciona</a><a href="https://save.thedate.now">¿Una boda?</a><a className="party-nav-action" href="https://crea.thedate.now">Mi espacio ↗</a></nav></header>
    <section className="party-hero party-shell">
      <div className="party-copy"><p className="party-eyebrow"><span className="party-sparkle">✳</span> CUALQUIER EXCUSA ES BUENA</p><h1>Haz del día<br />un <em>gran plan.</em></h1><p>Invitaciones con personalidad para cumpleaños, fiestas y encuentros. Organiza a todos, comparte cada detalle y deja que empiece la emoción.</p><div className="party-hero-actions"><a className="party-button" href="https://crea.thedate.now">Crear mi invitación <span>↗</span></a><a className="party-link" href="#como-funciona">Así funciona <span>↓</span></a></div><div className="party-chips"><span>✷ Cumpleaños</span><span>✦ Fiestas</span><span>◕ Reuniones</span><span>♡ Más momentos</span></div></div>
      <div className="party-stage" aria-label="Ejemplo de invitación"><span className="party-doodle party-doodle-one">✳</span><span className="party-doodle party-doodle-two">✦</span><span className="party-doodle party-doodle-three">◌</span><div className="party-paper party-paper-back" /><div className="party-paper party-paper-front"><div className="party-paper-top"><span>THE DATE PRESENTA</span><span>✷</span></div><span className="party-paper-kicker">NOS VEMOS PARA CELEBRAR</span><strong>¡Es mi<br /><i>cumple!</i></strong><div className="party-paper-confetti"><span>✦</span><span>●</span><span>✧</span></div><div className="party-paper-bottom"><span>12 OCT · 7:00 PM</span><span>BOGOTÁ, CO</span></div></div><div className="party-rsvp"><span>✓</span><div><b>¡Voy de una!</b><small>Respuesta confirmada</small></div></div><div className="party-address">cumplelucas.thedate.now <span>↗</span></div></div>
    </section>
    <div className="party-marquee" aria-hidden="true"><div>INVITA ✳ CELEBRA ✳ REÚNE ✳ REPITE ✳ INVITA ✳ CELEBRA ✳ REÚNE ✳ REPITE ✳</div></div>
    <section className="party-occasions party-shell" id="ideas"><div className="party-section-head"><div><p className="party-eyebrow">PARA TODOS ESOS DÍAS QUE CUENTAN</p><h2>La vida pide<br /><em>celebrarse.</em></h2></div><p>Desde una fiesta enorme hasta una cena con los de siempre. Dale a cada ocasión un lugar propio.</p></div><div className="party-occasion-grid"><article className="occasion-birthday"><span>01 / SOPLA LAS VELAS</span><b aria-hidden="true">✴</b><h3>Cumpleaños</h3><p>Otra vuelta al sol merece algo más que un mensaje en el grupo.</p></article><article className="occasion-party"><span>02 / SUBE EL VOLUMEN</span><b aria-hidden="true">✶</b><h3>Fiestas</h3><p>Reúne a tu gente y deja que todos sepan dónde, cuándo y cómo.</p></article><article className="occasion-gather"><span>03 / HAGAMOS PLAN</span><b aria-hidden="true">◌</b><h3>Encuentros</h3><p>Una comida, una graduación o simplemente ganas de vernos.</p></article></div></section>
    <section className="party-how" id="como-funciona"><div className="party-shell"><div className="party-how-intro"><p className="party-eyebrow">DE LA IDEA AL “¡ALLÁ ESTARÉ!”</p><h2>Todo fluye<br /><em>mejor junto.</em></h2></div><div className="party-steps"><article><span>01</span><h3>Hazla tuya</h3><p>Elige el estilo, agrega fotos y escribe los detalles con tu voz.</p></article><article><span>02</span><h3>Invita fácil</h3><p>Comparte una dirección única y envía invitaciones por WhatsApp.</p></article><article><span>03</span><h3>Disfruta el plan</h3><p>Mira quién confirmó y lleva el aforo desde tu espacio.</p></article></div><div className="party-final"><span>¿Ya tienes una fecha?</span><a className="party-button" href="https://crea.thedate.now">Hagamos que pase ↗</a></div></div></section>
    <footer className="party-footer party-shell"><Brand /><span>Una buena historia siempre empieza con una invitación.</span><a href="https://save.thedate.now">Bodas en Save the Date ↗</a></footer>
  </main>;
}

function Invitation({ event }: { event: PublicEvent }) {
  const date = new Date(event.startAt);
  const dateText = Number.isNaN(date.getTime()) ? "Próximamente" : new Intl.DateTimeFormat("es", { dateStyle: "long", timeStyle: "short", timeZone: event.timeZone || "America/Bogota" }).format(date);
  const accent = /^#[0-9a-fA-F]{6}$/.test(event.accentColor) ? event.accentColor : "#ad7254";
  const virtual = event.kind === "general" && event.isVirtual;
  const placeLink = virtual ? event.virtualUrl : event.mapUrl;
  const safeLink = typeof placeLink === "string" && /^https:\/\/[^\s]+$/i.test(placeLink) ? placeLink : "";
  return <main className="invitation" style={{ "--accent": accent } as React.CSSProperties}><header className="invite-top"><a href={event.kind === "wedding" ? "https://save.thedate.now" : "https://thedate.now"}><Brand wedding={event.kind === "wedding"} /></a><span>UNA INVITACIÓN ESPECIAL</span></header><section className="invite-content"><div className="ornament">✧</div><p className="eyebrow">{event.kind === "wedding" ? "CELEBREMOS EL AMOR" : "ESTÁS INVITADO"}</p><h1>{event.title}</h1><div className="rule" /><p className="description">{event.description}</p>{event.photoKeys?.length > 0 && <div className="invite-gallery">{event.photoKeys.slice(0, 6).map(key => <img key={key} src={`https://api.thedate.now/public/events/${event.kind}/${event.slug}/photos/${encodeURIComponent(key)}`} alt={`Recuerdo de ${event.title}`} />)}</div>}<div className="details"><div><small>CUÁNDO</small><strong>{dateText}</strong></div><div><small>{virtual ? "MODALIDAD" : "DÓNDE"}</small><strong>{virtual ? "En línea" : event.location}</strong></div><div><small>ORGANIZA</small><strong>{event.organizer || "El anfitrión"}</strong></div></div>{safeLink && <><a className="invite-place-link" href={safeLink} target="_blank" rel="noopener noreferrer">{virtual ? "Unirse al evento virtual" : "Cómo llegar con Google Maps"} ↗</a>{!virtual && <small className="map-credit"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a></small>}</>}<p className="closing">Nos encantará compartir este momento contigo.</p></section><footer className="invite-footer">Una invitación creada con <b>the date.</b></footer></main>;
}

export default async function Home() {
  const host = (await headers()).get("host") ?? "";
  if (host.toLowerCase().startsWith("backoffice.thedate.now")) redirect("https://crea.thedate.now");
  if (host.toLowerCase().startsWith("crea.thedate.now")) return <Backoffice portal="general" />;
  if (host.toLowerCase().startsWith("studio.save.thedate.now")) return <Backoffice portal="wedding" />;
  const target = invitationFromHost(host);
  if (target) { const event = await findEvent(target.kind, target.slug); if (!event) notFound(); return <Invitation event={event} />; }
  return <Landing wedding={host.toLowerCase().startsWith("save.thedate.now")} />;
}
