import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const {
  ensureInvitationLink,
  protectInvitationEdit,
  moveInvitationLink,
  invitationMessagePreview,
} = loadSource("src/lib/events/invitation-message.ts");
test("the invitation always has exactly one link and keeps its chosen position", () => {
  assert.equal(ensureInvitationLink("Hola"), "Hola\n\n{{link}}");
  assert.equal(
    ensureInvitationLink("Antes {{enlace}} después"),
    "Antes {{link}} después",
  );
  assert.equal(ensureInvitationLink("A {{link}} B {{link}}"), "A {{link}} B ");
  assert.equal(ensureInvitationLink(""), "{{link}}");
  assert.equal(ensureInvitationLink("a".repeat(4000)).length, 4000);
  assert.match(ensureInvitationLink("a".repeat(4000)), /\{\{link\}\}$/);
});
test("deleting all text or part of the link cannot remove the link", () => {
  const value = "Hola {{link}} gracias";
  assert.equal(protectInvitationEdit(value, "").value, "{{link}}");
  assert.equal(
    protectInvitationEdit(value, "Hola {{lin}} gracias").value,
    value,
  );
  assert.equal(protectInvitationEdit(value, "Hola  gracias").value, value);
  assert.equal(
    protectInvitationEdit(value, "Nuevo texto").value,
    "Nuevo texto{{link}}",
  );
  assert.equal(protectInvitationEdit(value, value + "{{link}}").value, value);
});
test("the link moves to the cursor and allows text on both sides", () => {
  const initial = "Antes. Después. {{link}}";
  const moved = moveInvitationLink(initial, 7);
  assert.equal(moved.value, "Antes. {{link}}Después. ");
  assert.equal(moved.caret, 15);
  assert.equal(
    moveInvitationLink(moved.value, moved.value.length).value,
    "Antes. Después. {{link}}",
  );
  assert.equal(
    protectInvitationEdit("Hola {{link}}", "Hola {{link}} ¡Te esperamos!")
      .value,
    "Hola {{link}} ¡Te esperamos!",
  );
});

test("links stay clickable when neighboring text has no separating spaces", () => {
  assert.equal(
    invitationMessagePreview(
      "Antes{{link}}Después",
      "https://example.test/personal",
    ),
    "Antes https://example.test/personal Después",
  );
});
