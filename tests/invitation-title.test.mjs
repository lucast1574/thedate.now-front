import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { invitationTitle } = loadSource("src/lib/events/invitation-title.ts");
test("wedding names are separated, capitalized and stable while general titles retain their case", () => {
  for (const title of [
    "lucasyelizabeth",
    "LUCASYELIZABETH",
    "LucasyELIZABETH",
  ]) {
    assert.equal(
      invitationTitle("wedding", title, {
        partnerOne: "lucas",
        partnerTwo: "ELIZABETH",
      }),
      "Lucas y Elizabeth",
    );
  }
  for (const [input, expected] of [
    ["LucasyELIZABETH", "Lucas y Elizabeth"],
    [" lucas  y ELIZABETH ", "Lucas y Elizabeth"],
    ["MARÍA y josé", "María y José"],
    ["Ana de la CRUZ y YULIANA", "Ana de la Cruz y Yuliana"],
  ]) {
    assert.equal(invitationTitle("wedding", input), expected);
    assert.equal(invitationTitle("wedding", expected), expected);
  }
  assert.equal(invitationTitle("general", " Fiesta DJ "), "Fiesta DJ");
  assert.equal(
    invitationTitle("wedding", "Nuestra historia"),
    "Nuestra historia",
  );
});
