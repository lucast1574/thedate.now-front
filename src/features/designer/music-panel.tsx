import { useState } from "react";
import Icon from "@/components/icon";
import { musicFromLink } from "@/lib/events/music";
import type { useInvitationDesign } from "./use-invitation-design";
import { useMusicUpload } from "./use-music-upload";
export default function MusicPanel({
  editor,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
}) {
  const { draft, setDraft } = editor;
  const { upload, busy, error } = useMusicUpload(editor);
  const music = draft.music;
  const [link, setLink] = useState(
    music?.source === "youtube"
      ? `https://www.youtube.com/watch?v=${music.value}`
      : "",
  );
  const [linkError, setLinkError] = useState("");
  return (
    <section className="music-panel" aria-label="Música de la invitación">
      <p className="canvas-panel-description">
        Una canción para acompañar toda la invitación, sin añadirla a cada
        sección.
      </p>
      <div className="music-recommendation">
        <Icon name="music" />
        <strong>Música de fondo</strong>
        <p>
          Tu MP3 sonará en bucle, a volumen suave y sin reproductor visible. Si
          el navegador bloquea el inicio automático, comienza con el primer
          toque en la invitación.
        </p>
      </div>
      <label className="canvas-upload">
        <Icon name="plus" />
        {busy ? "Subiendo canción…" : "Subir MP3 · hasta 10 MB"}
        <input
          type="file"
          accept="audio/mpeg,.mp3"
          disabled={busy || editor.busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = "";
          }}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <h3>Enlace de YouTube</h3>
      <p className="canvas-panel-description">
        También puedes pegar una canción de YouTube o YouTube Music. Intentará
        sonar automáticamente, con volumen bajo y sin controles. Puede requerir
        un toque; anuncios, bloqueos o disponibilidad dependen de YouTube.
      </p>
      <label>
        Enlace de la canción
        <input
          type="url"
          placeholder="https://music.youtube.com/watch?v=…"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </label>
      <button
        type="button"
        disabled={busy || !link.trim()}
        onClick={() => {
          const next = musicFromLink(link);
          if (!next || next.source !== "youtube") {
            setLinkError("Pega un enlace de video de YouTube o YouTube Music.");
            return;
          }
          setLinkError("");
          setDraft((current) => ({ ...current, music: next }));
        }}
      >
        Usar canción de YouTube
      </button>
      {linkError && <p role="alert">{linkError}</p>}
      {music && (
        <section className="music-current">
          <h3>Canción elegida</h3>
          <label>
            Nombre
            <input
              maxLength={160}
              value={music.title}
              onChange={(e) =>
                setDraft((current) => ({
                  ...current,
                  music: current.music
                    ? { ...current.music, title: e.target.value }
                    : null,
                }))
              }
            />
          </label>
          {music.source === "mp3" ? (
            <audio
              controls
              preload="metadata"
              src={`/api/audio/${draft.id}/${music.value}`}
              aria-label="Escuchar canción elegida"
              onLoadedMetadata={(e) => {
                e.currentTarget.volume = 0.25;
              }}
            />
          ) : (
            <p>
              {music.source === "spotify"
                ? "Spotify ya no está disponible. Sustituye esta canción por YouTube o un MP3."
                : "YouTube · volumen suave y reproducción en bucle."}
            </p>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => setDraft((current) => ({ ...current, music: null }))}
          >
            <Icon name="close" /> Quitar música
          </button>
          <p className="canvas-panel-description">
            Guarda el diseño para aplicar el cambio.
          </p>
        </section>
      )}
    </section>
  );
}
