"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/icon";
import { musicEmbed, type InvitationMusic as Music } from "@/lib/events/music";
export default function InvitationMusic({
  music,
  audioSrc,
  preview = false,
}: {
  music?: Music | null;
  audioSrc?: string;
  preview?: boolean;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const entry = useRef<HTMLDialogElement>(null);
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (preview || music?.source !== "mp3") return;
    entry.current?.showModal();
    void audio.current
      ?.play()
      .then(() => {
        entry.current?.close();
        setEntered(true);
      })
      .catch(() => {});
  }, [music?.source, music?.value, preview]);
  if (!music) return null;
  const embed = musicEmbed(music);
  if (embed)
    return (
      <section className="invitation-music-embed">
        <Icon name="music" />
        <p>{music.title || "Nuestra música"}</p>
        {preview ? (
          <p>
            El reproductor de{" "}
            {music.source === "spotify" ? "Spotify" : "YouTube"} aparecerá en la
            invitación publicada.
          </p>
        ) : (
          <iframe
            src={embed}
            title={music.title || "Música de la invitación"}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className={
              music.source === "youtube" ? "youtube-music" : "spotify-music"
            }
          />
        )}
      </section>
    );
  if (music.source !== "mp3" || !/^[a-f0-9-]{36}\.mp3$/.test(music.value))
    return null;
  function enter() {
    const playing = audio.current?.play();
    entry.current?.close();
    setEntered(true);
    void playing?.catch(() =>
      setError(
        "No se pudo iniciar la música. Puedes intentarlo con el reproductor.",
      ),
    );
  }
  return (
    <>
      {!entered && !preview && (
        <dialog
          ref={entry}
          className="invitation-music-entry"
          aria-labelledby="music-entry-title"
          onCancel={(e) => {
            e.preventDefault();
            entry.current?.close();
            setEntered(true);
          }}
        >
          <div>
            <Icon name="music" />
            <p>Estás invitado a un día especial</p>
            <h2 id="music-entry-title">La celebración empieza aquí</h2>
            <button type="button" onClick={enter}>
              Abrir invitación <Icon name="arrow" />
            </button>
            <small>Con música · {music.title}</small>
            <button
              className="music-enter-silent"
              onClick={() => {
                entry.current?.close();
                setEntered(true);
              }}
            >
              Entrar sin sonido
            </button>
          </div>
        </dialog>
      )}
      <div
        className={`invitation-audio ${preview ? "" : "invitation-audio-floating"} ${!entered && !preview ? "awaiting-entry" : ""}`}
      >
        <button
          type="button"
          className="invitation-audio-toggle"
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          onClick={() => {
            if (!audio.current) return;
            if (audio.current.paused)
              void audio.current
                .play()
                .catch(() => setError("No se pudo iniciar la canción."));
            else audio.current.pause();
          }}
        >
          <Icon name={playing ? "pause" : "play"} />
        </button>
        <span>{music.title || "Nuestra canción"}</span>
        <audio
          ref={audio}
          hidden
          loop
          preload={preview ? "none" : "metadata"}
          src={audioSrc}
          aria-label="Música de la invitación"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() =>
            setError("La canción no está disponible en este momento.")
          }
        />
        {error && <small role="status">{error}</small>}
      </div>
    </>
  );
}
