export type YouTubePlayer = {
  playVideo: () => void;
  setVolume: (volume: number) => void;
  destroy: () => void;
};
type PlayerEvent = { target: YouTubePlayer; data: number };
type YouTubeAPI = {
  Player: new (
    element: HTMLElement,
    options: {
      width: number;
      height: number;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: PlayerEvent) => void;
        onStateChange: (event: PlayerEvent) => void;
        onError: () => void;
      };
    },
  ) => YouTubePlayer;
};
type YouTubeWindow = Window & {
  YT?: YouTubeAPI;
  onYouTubeIframeAPIReady?: () => void;
};
let loading: Promise<YouTubeAPI> | undefined;
export function youtubeAPI() {
  const target = window as YouTubeWindow;
  if (target.YT?.Player) return Promise.resolve(target.YT);
  if (loading) return loading;
  loading = new Promise<YouTubeAPI>((resolve, reject) => {
    const previous = target.onYouTubeIframeAPIReady;
    target.onYouTubeIframeAPIReady = () => {
      try {
        previous?.();
      } finally {
        if (target.YT?.Player) resolve(target.YT);
        else {
          loading = undefined;
          reject(new Error("YouTube unavailable"));
        }
      }
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.onerror = () => {
      script.remove();
      loading = undefined;
      reject(new Error("YouTube unavailable"));
    };
    document.head.appendChild(script);
  });
  return loading;
}
