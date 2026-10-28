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
