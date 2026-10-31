import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { recoveryRecord, recoverDesign, recoveryKey } = loadSource(
  "src/features/designer/design-recovery.ts",
);
const event = {
  id: "one",
  kind: "wedding",
  title: "Original",
  description: "Story",
  template: "classic",
  accentColor: "#112233",
  photoKeys: ["old"],
  sections: [],
};
test("recovery preserves local edits and refreshes untouched server fields", () => {
  const raw = recoveryRecord({ ...event, title: "Local" }, event);
  const result = recoverDesign(raw, {
    ...event,
    description: "New story",
    photoKeys: ["new"],
  });
  assert.equal(result.title, "Local");
  assert.equal(result.description, "New story");
  assert.deepEqual(Array.from(result.photoKeys), ["new"]);
});
test("copies cannot cross events or products", () => {
  const raw = recoveryRecord(event, event);
  assert.equal(recoverDesign(raw, { ...event, id: "two" }), null);
  assert.equal(recoverDesign(raw, { ...event, kind: "general" }), null);
  assert.notEqual(
    recoveryKey(event),
    recoveryKey({ ...event, kind: "general" }),
  );
});
test("expired and malformed copies are rejected", () => {
  const record = JSON.parse(recoveryRecord(event, event));
  assert.equal(
    recoverDesign(JSON.stringify({ ...record, savedAt: 1 }), event),
    null,
  );
  assert.equal(
    recoverDesign(JSON.stringify({ ...record, draft: {} }), event),
    null,
  );
  assert.throws(() => recoverDesign("broken", event));
});
