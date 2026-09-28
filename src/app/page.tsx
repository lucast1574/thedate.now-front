import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Backoffice from "./backoffice";

type Kind = "wedding" | "general";
type PublicEvent = { id: string; kind: Kind; slug: string; title: string; description: string; startAt: string; location: string; accentColor: string; photoKeys: string[] };

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

function Brand() { return <span className="brand"><span className="brand-icon">✳</span> the date<span className="dot">.</span></span>; }

function Landing({ wedding }: { wedding: boolean }) {
  return <main className={`site ${wedding ? "wedding" : "general"}`}>
    <header className="topbar shell"><a href={wedding ? "https://save.thedate.now" : "https://thedate.now"}><Brand /></a><nav><a href="#como-funciona">Cómo funciona</a><a href={wedding ? "https://thedate.now" : "https://save.thedate.now"}>{wedding ? "Otros eventos" : "Bodas"}</a><a className="nav-action" href="https://backoffice.thedate.now">Entrar ↗</a></nav></header>
    <section className="hero shell"><p className="eyebrow">✦ &nbsp;{wedding ? "SAVE THE DATE · BODAS" : "THE DATE · EVENTOS"}</p><h1>{wedding ? <>Una fecha.<br /><em>Para siempre.</em></> : <>Tu evento empieza<br /><em>con una invitación.</em></>}</h1><p className="hero-copy">{wedding ? "Invitaciones de boda que cuentan su historia. Confirmaciones por WhatsApp, aforo claro y cada detalle en un solo lugar." : "Cumpleaños, celebraciones y encuentros. Crea una invitación a tu estilo y organiza a tus invitados sin perder el hilo."}</p><div className="hero-actions"><a className="button" href="https://backoffice.thedate.now">Crear mi evento &nbsp; ↗</a><a className="text-link" href="#como-funciona">Descubre cómo funciona →</a></div><div className="hero-note">✧ Un enlace único para cada celebración</div></section>
    <section className="features" id="como-funciona"><div className="shell features-layout"><div><p className="eyebrow">01 / LA EXPERIENCIA</p><h2>Invitar debería ser<br /><em>parte de la emoción.</em></h2></div><div className="cards"><article><span className="card-symbol">↗</span><small>01</small><h3>Diseña a tu manera</h3><p>Elige una plantilla, agrega fotos y cuenta los detalles de tu día con tu propia voz.</p></article><article><span className="card-symbol">◌</span><small>02</small><h3>Cada invitado, al día</h3><p>Invita por WhatsApp y sigue las respuestas y los cupos desde un solo panel.</p></article><article><span className="card-symbol">✳</span><small>03</small><h3>Un lugar para recordar</h3><p>Comparte una dirección tan especial como el evento: {wedding ? "su-historia.save.thedate.now" : "tu-fiesta.thedate.now"}.</p></article></div></div></section>
    <footer className="footer shell"><Brand /><span>Hecho para los momentos que se quedan.</span><a href="https://backoffice.thedate.now">Empezar ↗</a></footer>
  </main>;
}

function Invitation({ event }: { event: PublicEvent }) {
  const date = new Date(event.startAt);
  const dateText = Number.isNaN(date.getTime()) ? "Próximamente" : new Intl.DateTimeFormat("es", { dateStyle: "long", timeZone: "UTC" }).format(date);
  const accent = /^#[0-9a-fA-F]{6}$/.test(event.accentColor) ? event.accentColor : "#ad7254";
  return <main className="invitation" style={{ "--accent": accent } as React.CSSProperties}><header className="invite-top"><a href={event.kind === "wedding" ? "https://save.thedate.now" : "https://thedate.now"}><Brand /></a><span>UNA INVITACIÓN ESPECIAL</span></header><section className="invite-content"><div className="ornament">✧</div><p className="eyebrow">{event.kind === "wedding" ? "CELEBREMOS EL AMOR" : "ESTÁS INVITADO"}</p><h1>{event.title}</h1><div className="rule" /><p className="description">{event.description}</p>{event.photoKeys?.length > 0 && <div className="invite-gallery">{event.photoKeys.slice(0, 6).map(key => <img key={key} src={`https://api.thedate.now/public/events/${event.kind}/${event.slug}/photos/${encodeURIComponent(key)}`} alt={`Recuerdo de ${event.title}`} />)}</div>}<div className="details"><div><small>CUÁNDO</small><strong>{dateText}</strong></div><div><small>DÓNDE</small><strong>{event.location}</strong></div></div><p className="closing">Nos encantará compartir este momento contigo.</p></section><footer className="invite-footer">Una invitación creada con <b>the date.</b></footer></main>;
}

export default async function Home() {
  const host = (await headers()).get("host") ?? "";
  if (host.toLowerCase().startsWith("backoffice.thedate.now")) return <Backoffice />;
  const target = invitationFromHost(host);
  if (target) { const event = await findEvent(target.kind, target.slug); if (!event) notFound(); return <Invitation event={event} />; }
  return <Landing wedding={host.toLowerCase().startsWith("save.thedate.now")} />;
}
