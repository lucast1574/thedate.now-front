import type { DesignSection } from "./invitation-designer";

const icons: Record<string, string> = { heart: "♡", sparkle: "✧", flower: "❀", ring: "◎", music: "♫", star: "★", calendar: "▦", none: "" };

export default function InvitationSections({ sections, kind, slug }: { sections?: DesignSection[]; kind: "wedding" | "general"; slug: string }) {
  if (!sections?.length) return null;
  return <div className="invite-sections">{sections.map(section => <section key={section.id} className="invite-section"><span aria-hidden="true">{icons[section.icon] || ""}</span><h2>{section.heading}</h2><p>{section.body}</p>{section.photoKey && <img src={`https://api.thedate.now/public/events/${kind}/${slug}/photos/${encodeURIComponent(section.photoKey)}`} alt={section.heading || "Foto de la invitación"} />}</section>)}</div>;
}
