import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { moveChoice, findChoice, listboxPosition } = loadSource(
  "src/lib/ui/listbox.ts",
);
const choices = [
  { value: "a", label: "Árbol" },
  { value: "b", label: "Administrador", disabled: true },
  { value: "c", label: "Circular" },
];
test("keyboard navigation wraps and never selects disabled roles", () => {
  assert.equal(moveChoice(choices, 0, 1), 2);
  assert.equal(moveChoice(choices, 2, 1), 0);
  assert.equal(moveChoice(choices, 0, -1), 2);
  assert.equal(moveChoice([], -1, 1), -1);
  assert.equal(
    moveChoice(
      choices.map((c) => ({ ...c, disabled: true })),
      0,
      1,
    ),
    -1,
  );
  assert.equal(findChoice(choices, "ar", 2), 0);
  assert.equal(findChoice(choices, "admin", 0), 0);
});
test("popup stays in narrow viewports and flips above when space below is insufficient", () => {
  const above = listboxPosition(
    { top: 650, bottom: 694, left: 200, width: 260 },
    390,
    720,
  );
  assert.equal(above.bottom, 76);
  assert.equal(above.left, 122);
  assert.equal(above.maxHeight, 280);
  const below = listboxPosition(
    { top: 20, bottom: 64, left: 10, width: 370 },
    390,
    844,
  );
  assert.equal(below.top, 70);
  assert.equal(below.width, 370);
});
