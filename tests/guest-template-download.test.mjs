import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
test("template download uses the designed workbook and reports HTTP failures", async () => {
  let clicked = false;
  const source = loadSource("src/lib/events/guest-spreadsheet.ts", {
    globals: {
      fetch: async (url) => {
        assert.equal(url, "/templates/plantilla-invitados.xlsx");
        return new Response(new Uint8Array([1, 2, 3]));
      },
      Blob,
      URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
      document: {
        createElement: () => ({
          click() {
            clicked = true;
          },
        }),
      },
      setTimeout: (fn) => fn(),
    },
  });
  await source.downloadGuestTemplate();
  assert.equal(clicked, true);
  const failing = loadSource("src/lib/events/guest-spreadsheet.ts", {
    globals: { fetch: async () => new Response(null, { status: 503 }) },
  });
  await assert.rejects(() => failing.downloadGuestTemplate(), /descargar/);
});

test("The Date downloads its own blue celebration workbook", async () => {
  let requested, downloaded;
  const source = loadSource("src/lib/events/guest-spreadsheet.ts", {
    globals: {
      fetch: async (url) => {
        requested = url;
        return new Response(new Uint8Array([1]));
      },
      Blob,
      URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
      document: {
        createElement: () => ({
          set download(name) {
            downloaded = name;
          },
          click() {},
        }),
      },
      setTimeout: (fn) => fn(),
    },
  });
  await source.downloadGuestTemplate("general");
  assert.equal(requested, "/templates/plantilla-invitados-the-date.xlsx");
  assert.equal(downloaded, "plantilla-invitados-the-date.xlsx");
});
