import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { sharingEvents } = loadSource("src/lib/events/sharing-events.ts");
test("sharing lists only real active owned paid events in either product, including admins", () => {
  for (const kind of ["general", "wedding"])
    for (const role of ["admin", "planner", "organizer"]) {
      const base = {
        id: "real",
        slug: "real",
        kind,
        ownerId: "owner",
        paymentStatus: "paid",
        startAt: "2099-01-01T18:00:00Z",
        timeZone: "America/Bogota",
      };
      const list = [
        base,
        { ...base, id: "foreign", ownerId: "other" },
        { ...base, id: "demo", isDemo: true },
        { ...base, id: "past", startAt: "2020-01-01T18:00:00Z" },
        { ...base, id: "unpaid", paymentStatus: "unpaid" },
        { ...base, id: "broken", startAt: "invalid" },
        { ...base, id: "missing", slug: "" },
      ];
      assert.deepEqual(
        Array.from(
          sharingEvents(list, kind, { id: "owner", role }),
          (e) => e.id,
        ),
        ["real"],
      );
    }
});
