import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const {
  calendarDays,
  localDay,
  moveDay,
  moveMonth,
  timeParts,
  timeValue,
  timeLabel,
  pickerPosition,
} = loadSource("src/lib/ui/date-time.ts");
test("calendar uses Monday first, leap years, and rejects invalid dates", () => {
  assert.equal(calendarDays(2026, 9)[3], "2026-10-01");
  assert.equal(calendarDays(2024, 1).filter(Boolean).length, 29);
  assert.equal(calendarDays(2025, 1).filter(Boolean).length, 28);
  assert.equal(localDay("2025-02-29"), null);
  assert.equal(localDay("2026-13-01"), null);
  assert.equal(localDay("invalid"), null);
  assert.ok(localDay("2024-02-29"));
});
test("calendar navigation preserves dates and clamps the day for shorter months", () => {
  assert.equal(moveDay("2026-12-31", 1), "2027-01-01");
  assert.equal(moveDay("2024-03-01", -1), "2024-02-29");
  assert.equal(moveMonth("2024-01-31", 1), "2024-02-29");
  assert.equal(moveMonth("2026-03-31", -1), "2026-02-28");
});
test("custom time picker converts every minute correctly including midnight and noon", () => {
  for (let hour = 0; hour < 24; hour++)
    for (let minute = 0; minute < 60; minute++) {
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const parts = timeParts(value);
      assert.equal(timeValue(parts.hour, parts.minute, parts.period), value);
    }
  assert.equal(timeLabel("00:00"), "12:00 a. m.");
  assert.equal(timeLabel("12:00"), "12:00 p. m.");
  assert.equal(timeLabel("19:37"), "7:37 p. m.");
});
test("picker panels fit narrow screens and avoid opening below the viewport", () => {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [1366, 768],
  ]) {
    const position = pickerPosition(
      { left: width - 100, bottom: height - 20 },
      width,
      height,
    );
    assert.ok(position.left >= 12);
    assert.ok(position.left + position.width <= width - 12);
    assert.ok(position.top >= 12 && position.top < height - 100);
  }
});
