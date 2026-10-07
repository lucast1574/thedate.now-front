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
  halfHourTimes,
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
test("half-hour choices cover the entire day without changing stored precise times", () => {
  const times = [...halfHourTimes("AM"), ...halfHourTimes("PM")];
  assert.equal(times.length, 48);
  assert.equal(new Set(times).size, 48);
  assert.equal(times[0], "00:00");
  assert.equal(times[24], "12:00");
  assert.equal(times.at(-1), "23:30");
  for (let i = 0; i < times.length; i++) {
    const [hour, minute] = times[i].split(":").map(Number);
    assert.equal(hour * 60 + minute, i * 30);
  }
  assert.equal(timeLabel("19:37"), "7:37 p. m.");
});
test("mobile picker panels fit the viewport at the bottom", () => {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [568, 320],
    [844, 390],
  ]) {
    const position = pickerPosition(
      { left: width - 100, top: height - 60, bottom: height - 20 },
      width,
      height,
    );
    assert.ok(position.left >= 12);
    assert.ok(position.left + position.width <= width - 12);
    assert.equal(position.bottom, 12);
    assert.ok(position.maxHeight + position.bottom <= height - 12);
  }
});
test("desktop popovers stay outside their field and choose available space", () => {
  const rect = { left: 1100, top: 200, bottom: 246 };
  const below = pickerPosition(rect, 1366, 768, 350);
  assert.equal(below.top, 254);
  assert.ok(below.left + below.width <= 1354);
  const aboveRect = { left: 300, top: 650, bottom: 696 };
  const above = pickerPosition(aboveRect, 1366, 768, 350);
  assert.equal(above.top + 350 + 8, aboveRect.top);
  const tight = pickerPosition(
    { left: 300, top: 300, bottom: 346 },
    1024,
    650,
    400,
  );
  assert.ok(tight.top >= 12 && tight.top + tight.maxHeight <= 638);
});

const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { default: TimePanel } = loadSource("src/components/time-panel.tsx");
test("time panel offers direct half-hour choices and retains the current precise value", () => {
  const html = renderToStaticMarkup(
    createElement(TimePanel, { value: "19:37", onChoose() {} }),
  );
  assert.equal(
    (html.match(/aria-label="[0-9]+:[0-9]+ p. m."/g) || []).length,
    24,
  );
  assert.match(html, /7:37 p. m./);
  assert.match(html, /7:30 p. m./);
  assert.doesNotMatch(html, /Minutos|Usar esta hora|time-columns/);
});
