import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

test("background MP3 has no entry screen, player or pause button", () => {
  const { default: Music } = loadSource(
    "src/features/invitations/invitation-music.tsx",
  );
  const html = renderToStaticMarkup(
    createElement(Music, {
      music: {
        source: "mp3",
        value: "b6ea72ce-c49d-4f94-ae71-0a69d23dbf1e.mp3",
        title: "Song",
      },
      audioSrc: "/song.mp3",
    }),
  );
  assert.match(html, /<audio/);
  assert.match(html, /hidden=""/);
  assert.match(html, /loop=""/);
  assert.doesNotMatch(html, /controls|<button|<dialog|<iframe/);
});

test("quiet gain precedes playback and a gesture retries blocked autoplay", async () => {
  let blocked = true,
    gainNode,
    sources = 0,
    effect;
  const listeners = new Map();
  const element = {
    volume: 1,
    paused: true,
    ownerDocument: {
      addEventListener: (type, handler) => listeners.set(type, handler),
      removeEventListener: (type, handler) => {
        if (listeners.get(type) === handler) listeners.delete(type);
      },
    },
    play: async () => {
      if (blocked) throw new Error("Autoplay blocked");
      element.paused = false;
    },
    pause: () => {
      element.paused = true;
    },
  };
  class FakeContext {
    state = "suspended";
    destination = {};
    createGain() {
      gainNode = { gain: { value: 1 }, connect() {} };
      return gainNode;
    }
    createMediaElementSource() {
      sources++;
      return { connect() {} };
    }
    async resume() {
      if (blocked) throw new Error("Gesture required");
      this.state = "running";
    }
    async suspend() {
      this.state = "suspended";
    }
    async close() {
      this.state = "closed";
    }
  }
  const { useBackgroundMusic } = loadSource(
    "src/features/invitations/use-background-music.ts",
    {
      mocks: {
        react: {
          useRef: (current) => ({ current }),
          useEffect: (callback) => {
            effect = callback;
          },
        },
      },
      globals: {
        window: { AudioContext: FakeContext },
        AudioContext: FakeContext,
        setTimeout,
        clearTimeout,
      },
    },
  );
  useBackgroundMusic({ current: element }, true, "/song.mp3");
  const cleanup = effect();
  await new Promise(setImmediate);
  assert.equal(gainNode.gain.value, 0.25);
  assert.equal(element.paused, true);
  assert.ok(listeners.has("pointerdown"));
  blocked = false;
  listeners.get("pointerdown")();
  await new Promise(setImmediate);
  assert.equal(element.paused, false);
  assert.equal(listeners.size, 0);
  cleanup();
  // Strict Mode's immediate effect replay must reuse the media element source.
  const cleanupReplay = effect();
  assert.equal(sources, 1);
  cleanupReplay();
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(element.paused, true);
  assert.equal(listeners.size, 0);
});

test("media volume remains quiet when Web Audio is unavailable", async () => {
  let effect;
  const element = {
    volume: 1,
    ownerDocument: { addEventListener() {}, removeEventListener() {} },
    play: async () => {},
    pause() {},
  };
  const { useBackgroundMusic } = loadSource(
    "src/features/invitations/use-background-music.ts",
    {
      mocks: {
        react: {
          useRef: (current) => ({ current }),
          useEffect: (callback) => {
            effect = callback;
          },
        },
      },
      globals: { window: {}, setTimeout, clearTimeout },
    },
  );
  useBackgroundMusic({ current: element }, true, "/song.mp3");
  const cleanup = effect();
  assert.equal(element.volume, 0.25);
  cleanup();
  await new Promise((resolve) => setTimeout(resolve, 5));
});
