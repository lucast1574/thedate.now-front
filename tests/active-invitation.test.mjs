import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const user = { id: "owner", role: "user" };
for (const kind of ["general", "wedding"]) {
  test(`${kind}: URL wins over memory and a single real invitation is selected beside its demo`, () => {
    const real = { id: "one", kind, ownerId: user.id, paymentStatus: "paid" };
    const demo = { ...real, id: "demo", isDemo: true };
    function selected(events, remembered, explicit = "") {
      let state = 0;
      return loadSource("src/features/studio/use-active-invitation.ts", {
        mocks: {
          react: {
            useEffect: () => {},
            useState: () => [state++ === 0 ? events : "", () => {}],
          },
          "next/navigation": {
            useParams: () => ({}),
            useSearchParams: () => new URLSearchParams(),
          },
          "./use-event-recency": { useEventRecency: () => remembered },
        },
      }).useActiveInvitation(user, kind, explicit).selected?.id;
    }
    assert.equal(selected([real, demo], ""), "one");
    assert.equal(selected([real, demo], "one", "demo"), "demo");
    assert.equal(selected([real, { ...real, id: "two" }, demo], ""), undefined);
    assert.equal(selected([real, { ...real, id: "two" }], "two", "one"), "one");
    assert.equal(selected([real, demo], "", "unauthorized"), undefined);
  });
}
