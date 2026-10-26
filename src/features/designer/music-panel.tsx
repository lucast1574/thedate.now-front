import Icon from "@/components/icon";
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
      <p className="canvas-panel-description">
        Para este fondo musical utiliza un MP3. Los enlaces de Spotify y YouTube
        requieren su reproductor visible.
      </p>
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
              Este diseño conserva un enlace de{" "}
              {music.source === "spotify" ? "Spotify" : "YouTube"} con su
              reproductor visible. Sube un MP3 para sustituirlo por música de
              fondo discreta.
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
