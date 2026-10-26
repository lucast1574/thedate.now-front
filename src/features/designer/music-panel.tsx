import { useState } from "react";
import Icon from "@/components/icon";
import { musicFromLink, musicEmbed } from "@/lib/events/music";
import type { useInvitationDesign } from "./use-invitation-design";
import { useMusicUpload } from "./use-music-upload";
export default function MusicPanel({
  editor,
}: {
  editor: ReturnType<typeof useInvitationDesign>;
}) {
  const { draft, setDraft } = editor;
  const { upload, busy, error } = useMusicUpload(editor);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const music = draft.music;
  const embed = music ? musicEmbed(music) : null;
  function applyLink() {
    const next = musicFromLink(link);
    if (!next) {
      setLinkError(
        "Pega un enlace de canción, álbum o playlist de Spotify, o de un video de YouTube / YouTube Music.",
      );
      return;
    }
    setLinkError("");
    setDraft((current) => ({ ...current, music: next }));
  }
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
          Sube tu MP3. Al abrir la invitación, el primer toque permite que
          empiece a sonar.
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
      <h3>Spotify o YouTube Music</h3>
      <p className="canvas-panel-description">
        Se muestran con su reproductor visible. El invitado pulsa reproducir; el
        servicio determina la disponibilidad de la canción.
      </p>
      <label>
        Enlace de la canción
        <input
          type="url"
          placeholder="https://open.spotify.com/track/…"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </label>
      <button type="button" onClick={applyLink} disabled={busy || !link.trim()}>
        Usar este enlace
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
            />
          ) : (
            <p>
              {embed
                ? music.source === "spotify"
                  ? "Reproductor de Spotify"
                  : "Reproductor de YouTube"
                : "Enlace no válido"}
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
