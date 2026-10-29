import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

test("saving edits returns to the gallery only after a successful save", async () => {
  for (const fails of [false, true]) {
    const calls = [];
    let submit;
    const feedback = {
      async run(action, message) {
        try {
          await action();
          calls.push(message);
        } catch {
          calls.push("error");
        }
      },
    };
    const mocks = {
      "next/navigation": {
        useRouter: () => ({ push: (url) => calls.push(url) }),
        useSearchParams: () => new URLSearchParams({ event: "wedding" }),
      },
      "./use-feedback": { useFeedback: () => feedback },
      "./use-studio-session": {
        useStudioSession: () => ({ user: { id: "owner", role: "user" } }),
      },
      "./use-studio-events": {
        useStudioEvents: () => ({
          selected: { id: "wedding", ownerId: "owner", paymentStatus: "paid" },
          async saveEvent() {
            calls.push("save");
            if (fails) throw new Error("Save failed");
          },
          createDraft: () => calls.push("gallery"),
        }),
      },
      "./use-event-actions": { useEventActions: () => ({}) },
      "@/components/color-memory": {
        ColorMemoryProvider: ({ children }) => children,
      },
      "./event-workspace": {
        default: ({ save }) => {
          submit = save;
          return null;
        },
      },
    };
    for (const name of [
      "auth-panel",
      "studio-header",
      "workspace-sidebar",
      "professional-upgrade",
      "event-gallery",
      "product-alternative",
    ])
      mocks[`./${name}`] = { default: () => null };
    const Studio = loadSource("src/features/studio/studio.tsx", {
      mocks,
    }).default;
    renderToStaticMarkup(React.createElement(Studio, { portal: "wedding" }));
    await submit({ preventDefault() {} });
    assert.deepEqual(
      calls,
      fails
        ? ["save", "error"]
        : ["save", "gallery", "/", "Cambios guardados."],
    );
  }
});
