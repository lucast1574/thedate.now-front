import type { WebPushConfig } from "./web-config";

export function browserPushWorker(config: WebPushConfig) {
  const { apiKey, appId, messagingSenderId, projectId } = config;
  return new Response(
    `self.addEventListener("notificationclick", (event) => {
      const path = event.notification.data?.studioPath;
      if (typeof path !== "string" || !path.startsWith("/manager/")) return;
      event.stopImmediatePropagation();
      event.notification.close();
      const url = new URL(path, self.location.origin).href;
      event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true })
        .then((clients) => {
          const client = clients.find((item) => item.url === url);
          return client ? client.focus() : self.clients.openWindow(url);
        }));
    });
    importScripts(
      "https://www.gstatic.com/firebasejs/13.4.0/firebase-app-compat.js",
      "https://www.gstatic.com/firebasejs/13.4.0/firebase-messaging-compat.js"
    );
    firebase.initializeApp(${JSON.stringify({ apiKey, appId, messagingSenderId, projectId })});
    firebase.messaging();`,
    {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "private, no-store",
      },
    },
  );
}
