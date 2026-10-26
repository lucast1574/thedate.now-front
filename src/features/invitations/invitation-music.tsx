"use client";
import { useRef } from "react";
import Icon from "@/components/icon";
import { musicEmbed, type InvitationMusic as Music } from "@/lib/events/music";
import { useBackgroundMusic } from "./use-background-music";
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
  const mp3 =
    music?.source === "mp3" && /^[a-f0-9-]{36}\.mp3$/.test(music.value);
  useBackgroundMusic(audio, Boolean(mp3 && !preview), audioSrc);
  if (!music) return null;
  if (mp3)
    return (
      <audio
        ref={audio}
        hidden
        loop
        preload="metadata"
        src={audioSrc}
        aria-hidden="true"
      />
    );
  // Existing provider links keep their official visible players. The editor
  // asks the author to replace them with an MP3 for invisible background audio.
  const embed = musicEmbed(music);
  if (!embed) return null;
  return (
    <section className="invitation-music-embed">
      <Icon name="music" />
      <p>{music.title || "Nuestra música"}</p>
      {preview ? (
        <p>
          Este enlace conserva el reproductor visible de{" "}
          {music.source === "spotify" ? "Spotify" : "YouTube"}. Para música de
          fondo sin controles, sube un MP3.
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
}
