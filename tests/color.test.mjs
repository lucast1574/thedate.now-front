import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const {
  colorAdjustmentKey,
  normalizeColor,
  hexToHsv,
  hsvToHex,
  recentColors,
  rememberColor,
} = loadSource("src/lib/ui/color.ts");
test("hex codes normalize and reject malformed colors", () => {
  assert.equal(normalizeColor(" abc "), "#AABBCC");
  assert.equal(normalizeColor("#8150c7"), "#8150C7");
  for (const value of [
    null,
    123,
    "red",
    "#12",
    "#12345g",
    "#FFFFFFFF",
    "url(x)",
  ])
    assert.equal(normalizeColor(value), null);
});
test("color space conversions preserve palette, endpoints and varied colors", () => {
  for (const color of [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#8150C7",
    "#AD7254",
    "#123456",
    "#FA7851",
  ])
    assert.equal(hsvToHex(hexToHsv(color)), color);
  assert.equal(hsvToHex({ h: 360, s: 1, v: 1 }), "#FF0000");
  assert.equal(hsvToHex({ h: -120, s: 1, v: 1 }), "#0000FF");
  assert.equal(hsvToHex({ h: 120, s: 1, v: 0 }), "#000000");
});
test("recent colors validate stored data, deduplicate and keep only the latest twelve", () => {
  assert.deepEqual([...recentColors({})], []);
  assert.deepEqual(
    [...recentColors(["#abc", "#AABBCC", null, "invalid", "123456"])],
    ["#AABBCC", "#123456"],
  );
  assert.deepEqual(
    [...rememberColor(["#AABBCC", "#123456"], "#123456")],
    ["#123456", "#AABBCC"],
  );
  const many = Array.from(
    { length: 20 },
    (_, i) => `#${i.toString(16).padStart(6, "0")}`,
  );
  assert.equal(rememberColor(many, "#FFFFFF").length, 12);
  assert.equal(rememberColor(many, "#FFFFFF")[0], "#FFFFFF");
  assert.deepEqual([...rememberColor(["#123456"], "invalid")], ["#123456"]);
});

test("only color adjustment keys commit slider values, tabbing never rounds a color", () => {
  for (const key of ["Tab", "Shift", "Escape", "Enter"])
    assert.equal(colorAdjustmentKey(key), false);
  for (const key of ["ArrowLeft", "ArrowDown", "Home", "End", "PageUp"])
    assert.equal(colorAdjustmentKey(key), true);
});
