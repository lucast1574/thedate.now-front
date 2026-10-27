import { useEffect } from "react";

export function useLiveResponses(
  enabled: boolean,
  refresh: () => Promise<void>,
  onError: (message: string) => void,
) {
  useEffect(() => {
    if (!enabled) return;
    let stopped = false;
    let pending = false;
    let timer: ReturnType<typeof setTimeout>;
    async function sync() {
      clearTimeout(timer);
      if (stopped || pending || document.hidden || !navigator.onLine) return;
      pending = true;
      try {
        await refresh();
      } catch (error) {
        if (!stopped) onError((error as Error).message);
      } finally {
        pending = false;
        if (!stopped) timer = setTimeout(sync, 5000);
      }
    }
    timer = setTimeout(sync, 5000);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("online", sync);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("online", sync);
    };
  }, [enabled, refresh, onError]);
}
