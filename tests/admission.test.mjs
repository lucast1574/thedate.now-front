import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { amountToCents, admissionTotal, admissionMoney } = loadSource(
  "src/lib/events/admission.ts",
);
test("manual payment amounts preserve cents and reject ambiguous values", () => {
  assert.equal(amountToCents("80"), 8000);
  assert.equal(amountToCents("12,50"), 1250);
  assert.equal(amountToCents("0.29"), 29);
  for (const value of ["", "0", "-2", "1e3", "1,000.00", "1.234", "1000001"])
    assert.equal(amountToCents(value), null, value);
});
test("admission totals distinguish groups and people and show the configured currency", () => {
  const admission = {
    enabled: true,
    currency: "PEN",
    amountCents: 8000,
    basis: "person",
  };
  assert.equal(admissionTotal(admission, 2), 16000);
  assert.equal(admissionTotal({ ...admission, basis: "group" }, 2), 8000);
  assert.match(admissionMoney(1250, "PEN"), /PEN/);
  assert.match(admissionMoney(1250, "USD"), /USD/);
});
