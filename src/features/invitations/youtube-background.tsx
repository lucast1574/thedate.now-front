"use client";
import { useEffect, useRef } from "react";
import { youtubeAPI, type YouTubePlayer } from "./youtube-api";
export default function YouTubeBackground({
  videoId,
  preview,
}: {
  videoId: string;
  preview: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = host.current;
    if (preview || !container || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return;
    let player: YouTubePlayer | undefined;
    let ready = false,
      disposed = false;
    function play() {
      if (ready && !disposed) player?.playVideo();
    }
    function keyboard(event: KeyboardEvent) {
      if (
        !event.repeat &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        event.key !== "Escape"
      )
        play();
    }
    function detach() {
      document.removeEventListener("pointerdown", play, true);
      document.removeEventListener("keydown", keyboard, true);
    }
    document.addEventListener("pointerdown", play, {
      capture: true,
      passive: true,
    });
    document.addEventListener("keydown", keyboard, true);
    void youtubeAPI()
      .then((api) => {
        if (disposed) return;
        const params = {
          playsinline: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          origin: window.location.origin,
          fs: 0,
        };
        const element = document.createElement("iframe");
        element.title = "Música de la invitación";
        element.referrerPolicy = "strict-origin-when-cross-origin";
        element.allow =
          "autoplay; encrypted-media; fullscreen; picture-in-picture";
        element.tabIndex = -1;
        element.width = "320";
        element.height = "240";
        const query = new URLSearchParams({
          enablejsapi: "1",
          ...Object.fromEntries(
            Object.entries(params).map(([key, value]) => [key, String(value)]),
          ),
        });
        element.src = `https://www.youtube-nocookie.com/embed/${videoId}?${query}`;
        container.appendChild(element);
        player = new api.Player(element, {
          width: 320,
          height: 240,
          videoId,
          playerVars: params,
          events: {
            onReady: (event) => {
              if (disposed) return;
              ready = true;
              event.target.setVolume(25);
              event.target.playVideo();
            },
            onStateChange: (event) => {
              if (event.data === 1) detach();
            },
            onError: detach,
          },
        });
      })
      .catch(detach);
    return () => {
      disposed = true;
      detach();
      player?.destroy();
      container.replaceChildren();
    };
  }, [preview, videoId]);
  if (preview)
    return (
      <p className="canvas-panel-description">
        YouTube sonará en la invitación publicada. Puede necesitar el primer
        toque y depende de la disponibilidad del video.
      </p>
    );
  return (
    <div
      ref={host}
      className="invitation-youtube-background"
      aria-hidden="true"
      inert
    />
  );
}
