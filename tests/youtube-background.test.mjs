import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

test("YouTube renders a noninteractive hidden host and Spotify renders nothing", () => {
  const { default: Music } = loadSource(
    "src/features/invitations/invitation-music.tsx",
  );
  const html = renderToStaticMarkup(
    createElement(Music, {
      music: { source: "youtube", value: "M7lc1UVf-VE", title: "Song" },
    }),
  );
  assert.match(html, /invitation-youtube-background/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /inert=""/);
  assert.doesNotMatch(html, /<button|<dialog|<iframe|Song/);
  assert.equal(
    renderToStaticMarkup(
      createElement(Music, {
        music: {
          source: "spotify",
          value: "https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC",
          title: "Old song",
        },
      }),
    ),
    "",
  );
});

test("YouTube sets quiet volume before playing, retries a gesture, loops and cleans up", async () => {
  let effect,
    options,
    iframe,
    destroyed = false;
  const listeners = new Map(),
    calls = [];
  const container = {
    appendChild(element) {
      iframe = element;
    },
    replaceChildren() {},
  };
  const player = {
    playVideo() {
      calls.push("play");
    },
    setVolume(value) {
      calls.push(["volume", value]);
    },
    destroy() {
      destroyed = true;
    },
  };
  class Player {
    constructor(element, config) {
      iframe = element;
      options = config;
      return player;
    }
  }
  const { default: YouTube } = loadSource(
    "src/features/invitations/youtube-background.tsx",
    {
      mocks: {
        react: {
          useRef: () => ({ current: container }),
          useEffect: (callback) => {
            effect = callback;
          },
        },
        "./youtube-api": { youtubeAPI: async () => ({ Player }) },
      },
      globals: {
        URLSearchParams,
        window: { location: { origin: "https://ana.save.thedate.now" } },
        document: {
          createElement: () => ({}),
          addEventListener(type, handler) {
            listeners.set(type, handler);
          },
          removeEventListener(type, handler) {
            if (listeners.get(type) === handler) listeners.delete(type);
          },
        },
      },
    },
  );
  YouTube({ videoId: "M7lc1UVf-VE", preview: false });
  const cleanup = effect();
  await new Promise(setImmediate);
  assert.equal(iframe.referrerPolicy, "strict-origin-when-cross-origin");
  assert.match(
    iframe.src,
    /^https:\/\/www.youtube-nocookie.com\/embed\/M7lc1UVf-VE\?/,
  );
  assert.equal(iframe.tabIndex, -1);
  assert.equal(options.playerVars.loop, 1);
  assert.equal(options.playerVars.playlist, "M7lc1UVf-VE");
  assert.equal(options.playerVars.controls, 0);
  options.events.onReady({ target: player });
  assert.deepEqual(calls, [["volume", 25], "play"]);
  listeners.get("pointerdown")();
  assert.equal(calls.at(-1), "play");
  assert.equal(calls.length, 3);
  options.events.onStateChange({ data: 1, target: player });
  assert.equal(listeners.size, 0);
  cleanup();
  assert.equal(destroyed, true);
});
