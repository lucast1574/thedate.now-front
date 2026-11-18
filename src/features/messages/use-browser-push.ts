import { useEffect } from "react";

export function useBrowserPush(userId: string, wedding: boolean) {
  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted")
      return;
    const connect = () =>
      void import("./browser-push")
        .then(({ browserPushEnabled, connectBrowserPush }) => {
          if (browserPushEnabled(userId))
            return connectBrowserPush(userId, wedding);
        })
        .catch(() => {});
    connect();
    const heartbeat = window.setInterval(connect, 60 * 60 * 1000);
    return () => window.clearInterval(heartbeat);
  }, [userId, wedding]);
}
