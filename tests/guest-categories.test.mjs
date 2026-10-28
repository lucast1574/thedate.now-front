import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { guestCategory, guestCategories } = loadSource(
  "src/lib/events/guest-categories.ts",
);
const { parseGuestRows } = loadSource("src/lib/events/guest-rows.ts");
test("categories normalize spelling without inventing groups", () => {
  assert.equal(
    guestCategory("  COMPANEROS  de trabajo "),
    "Compañeros de trabajo",
  );
  assert.equal(guestCategory(""), "");
  for (const category of guestCategories)
    assert.equal(guestCategory(category), category);
  assert.throws(() => guestCategory("Familia Rojas"), /categoría/);
  const parse = (value) =>
    parseGuestRows([
      ["nombre", "telefono", "categoria"],
      ["Ana", "+51987654321", value],
    ]);
  assert.equal(parse("amigos del novio")[0].family, "Amigos del novio");
  assert.throws(() => parse("Familia Rojas"), /fila 2/);
});
