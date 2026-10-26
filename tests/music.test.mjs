import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { musicFromLink, musicEmbed } = loadSource("src/lib/events/music.ts", {
  globals: { URL },
});
test("music links canonicalize provider URLs and reject spoofed hosts", () => {
  const spotify = musicFromLink(
    "https://open.spotify.com/intl-es/track/4uLU6hMCjMI75M1A2tKUQC?si=share",
  );
  assert.equal(spotify.source, "spotify");
  assert.equal(
    musicEmbed(spotify),
    "https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC",
  );
  for (const url of [
    "https://music.youtube.com/watch?v=dQw4w9WgXcQ&si=share",
    "https://youtu.be/dQw4w9WgXcQ",
  ]) {
    const youtube = musicFromLink(url);
    assert.equal(youtube.source, "youtube");
    assert.match(
      musicEmbed(youtube),
      /^https:\/\/www.youtube-nocookie.com\/embed\/dQw4w9WgXcQ/,
    );
  }
  for (const url of [
    "javascript:alert(1)",
    "https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ",
    "https://open.spotify.com@evil.test/track/4uLU6hMCjMI75M1A2tKUQC",
    "https://open.spotify.com:444/track/4uLU6hMCjMI75M1A2tKUQC",
    "http://youtu.be/dQw4w9WgXcQ",
  ])
    assert.equal(musicFromLink(url), null);
});
test("music participates in save, dirty state and refresh merges", () => {
  const { designPayload, sameDesign } = loadSource(
    "src/features/designer/design-state.ts",
  );
  const { mergeDesign } = loadSource("src/features/designer/merge-design.ts");
  const original = {
    kind: "wedding",
    template: "classic",
    title: "Nuestra boda",
    photoKeys: [],
  };
  const music = {
    source: "youtube",
    value: "dQw4w9WgXcQ",
    title: "Nuestra canción",
  };
  const edited = { ...original, music };
  assert.equal(sameDesign(original, edited), false);
  assert.equal(designPayload(edited).music, music);
  assert.equal(
    mergeDesign(edited, original, { ...original, title: "Guardado" }).music,
    music,
  );
  assert.equal(designPayload({ ...edited, music: null }).music, null);
});
test("invitation runtime allows only pinned public audio routes", () => {
  const { allowedInvitationPath } = loadSource(
    "src/lib/events/invitation-runtime.ts",
    { globals: { process: { env: {} } } },
  );
  assert.equal(
    allowedInvitationPath("/api/public-audio/wedding/ana-y-luis/a123.mp3"),
    true,
  );
  assert.equal(allowedInvitationPath("/api/audio/private/file.mp3"), false);
  assert.equal(
    allowedInvitationPath("/api/public-audio/wedding/ana/../../secret"),
    false,
  );
});
