"use client";
import { useRef } from "react";
import type { InvitationMusic as Music } from "@/lib/events/music";
import { useBackgroundMusic } from "./use-background-music";
import YouTubeBackground from "./youtube-background";
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
  if (music.source === "youtube" && /^[A-Za-z0-9_-]{11}$/.test(music.value))
    return <YouTubeBackground videoId={music.value} preview={preview} />;
  return null;
}
