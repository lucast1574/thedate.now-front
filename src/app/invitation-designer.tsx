"use client";

import { useState } from "react";

export type DesignSection = { id: string; icon: string; heading: string; body: string; photoKey?: string };
export type DesignEvent = { id: string; kind: "wedding" | "general"; title: string; description: string; template: string; accentColor: string; sections?: DesignSection[]; photoKeys: string[]; isDemo?: boolean };

const icons: Record<string, string> = { heart: "♡", sparkle: "✧", flower: "❀", ring: "◎", music: "♫", star: "★", calendar: "▦", none: " " };

export default function InvitationDesigner({ event, onSaved }: { event: DesignEvent; onSaved: () => Promise<void> }) {
  const [draft, setDraft] = useState(event);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const sections = draft.sections || [];
  const updateSection = (index: number, patch: Partial<DesignSection>) => setDraft(current => ({ ...current, sections: (current.sections || []).map((item, n) => n === index ? { ...item, ...patch } : item) }));
  const moveSection = (index: number, direction: number) => setDraft(current => { const list = [...(current.sections || [])]; const next = index + direction; if (next < 0 || next >= list.length) return current; [list[index], list[next]] = [list[next], list[index]]; return { ...current, sections: list }; });
  async function save() {
    setBusy(true); setMessage("");
    try {
      const result = await fetch(`/api/backend/events/${draft.id}/design`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: draft.title, description: draft.description, template: draft.template, accentColor: draft.accentColor, sections }) });
      const body = await result.json(); if (!result.ok) throw new Error(body.error || "No se pudo guardar");
      await onSaved(); setMessage("Diseño guardado.");
    } catch (error) { setMessage((error as Error).message); } finally { setBusy(false); }
  }
  async function upload(file: File) {
    setBusy(true); setMessage("");
    try {
      const data = new FormData(); data.append("photo", file);
      const result = await fetch(`/api/photos/${draft.id}`, { method: "POST", body: data });
      const body = await result.json(); if (!result.ok) throw new Error(body.error || "No se pudo subir la foto");
      setDraft(current => ({ ...current, photoKeys: [...current.photoKeys, body.key] })); await onSaved();
      setMessage("Imagen añadida. Ahora puedes usarla en una sección.");
    } catch (error) { setMessage((error as Error).message); } finally { setBusy(false); }
  }
  return <section className="designer"><div className="office-divider" /><p className="office-kicker">EDITOR DE INVITACIÓN</p><h2>Diseña cada detalle.</h2><p>Prueba colores, fotos, símbolos y secciones. Los cambios se ven en la vista previa al instante.</p>
    <div className="designer-layout"><div className="designer-controls"><label>Título<input maxLength={160} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label><label>Mensaje<textarea rows={4} maxLength={5000} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} /></label><div className="form-grid"><label>Estilo<select value={draft.template} onChange={e => setDraft({ ...draft, template: e.target.value })}><option value="classic">Clásico</option><option value="modern">Moderno</option></select></label><label>Color<input type="color" value={draft.accentColor} onChange={e => setDraft({ ...draft, accentColor: e.target.value })} /></label></div>
      <label className="photo-upload">＋ Subir imagen<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => { const file = e.target.files?.[0]; if (file) upload(file); e.target.value = ""; }} /></label>
      <div className="designer-sections"><h3>Secciones</h3>{sections.map((section, index) => <div className="designer-section" key={section.id}><div className="designer-section-head"><strong>Sección {index + 1}</strong><div><button type="button" disabled={index === 0} onClick={() => moveSection(index, -1)} aria-label="Subir sección">↑</button><button type="button" disabled={index === sections.length - 1} onClick={() => moveSection(index, 1)} aria-label="Bajar sección">↓</button><button type="button" onClick={() => setDraft(current => ({ ...current, sections: (current.sections || []).filter(item => item.id !== section.id) }))} aria-label="Eliminar sección">×</button></div></div><label>Icono<select value={section.icon} onChange={e => updateSection(index, { icon: e.target.value })}>{Object.entries(icons).map(([key, symbol]) => <option key={key} value={key}>{symbol} {key}</option>)}</select></label><label>Encabezado<input maxLength={120} value={section.heading} onChange={e => updateSection(index, { heading: e.target.value })} /></label><label>Texto<textarea rows={3} maxLength={2000} value={section.body} onChange={e => updateSection(index, { body: e.target.value })} /></label><label>Imagen<select value={section.photoKey || ""} onChange={e => updateSection(index, { photoKey: e.target.value })}><option value="">Sin imagen</option>{draft.photoKeys.map((key, n) => <option key={key} value={key}>Imagen {n + 1}</option>)}</select></label></div>)}<button type="button" className="new-event" disabled={sections.length >= 20} onClick={() => setDraft(current => ({ ...current, sections: [...(current.sections || []), { id: crypto.randomUUID(), icon: "heart", heading: "Una nueva sección", body: "Escribe aquí tu historia." }] }))}>＋ Añadir sección</button></div><button type="button" className="office-button" disabled={busy} onClick={save}>Guardar diseño ↗</button>{message && <p role="status" className="designer-message">{message}</p>}</div>
      <div className="designer-preview" style={{ "--designer-accent": draft.accentColor } as React.CSSProperties}><div className={`designer-paper ${draft.template === "modern" ? "designer-modern" : ""}`}><small>{draft.kind === "wedding" ? "SAVE THE DATE" : "THE DATE"}</small><div className="designer-ornament">{draft.kind === "wedding" ? "❀" : "✳"}</div><h2>{draft.title || "Tu celebración"}</h2><p>{draft.description}</p>{draft.photoKeys.length > 0 && <img className="designer-hero-photo" src={`/api/photos/${draft.id}/${encodeURIComponent(draft.photoKeys[0])}`} alt="Vista previa" />}{sections.map(section => <article key={section.id}><span>{icons[section.icon]}</span><h3>{section.heading}</h3><p>{section.body}</p>{section.photoKey && <img src={`/api/photos/${draft.id}/${encodeURIComponent(section.photoKey)}`} alt="Sección" />}</article>)}{draft.isDemo && <div className="designer-watermark">DEMO · SAVE THE DATE</div>}</div></div></div>
  </section>;
}
