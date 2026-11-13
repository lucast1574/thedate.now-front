import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const {
  ensureInvitationLink,
  cleanInvitationMessage,
  protectInvitationEdit,
  moveInvitationLink,
  invitationMessagePreview,
} = loadSource("src/lib/events/invitation-message.ts");

test("invitation message cleans legacy link placeholders so only author text remains", () => {
  assert.equal(cleanInvitationMessage("Hola\n\n{{link}}"), "Hola");
  assert.equal(
    cleanInvitationMessage("Antes {{enlace}} después"),
    "Antes  después",
  );
  assert.equal(cleanInvitationMessage("A {{link}} B {{link}}"), "A  B");
  assert.equal(cleanInvitationMessage("{{link}}"), "");
  assert.equal(ensureInvitationLink("Hola {{link}}"), "Hola");
});

test("editing text cleans tokens without enforcing link tokens in the field", () => {
  const value = "Hola gracias";
  assert.equal(protectInvitationEdit(value, "Hola").value, "Hola");
  assert.equal(protectInvitationEdit(value, "Hola {{link}}").value, "Hola");
  assert.equal(moveInvitationLink("Hola {{link}}", 0).value, "Hola");
});

test("invitation message preview prefixes personal link and appends poll instruction", () => {
  assert.equal(
    invitationMessagePreview(
      "¡Te esperamos!\nConoce los detalles.",
      "https://example.test/personal",
    ),
    "Abre tu invitación:\nhttps://example.test/personal\n\n¡Te esperamos!\nConoce los detalles.\n\n👇 Por favor, responde en la encuesta de aquí abajo para confirmar tu asistencia.",
  );
  assert.equal(
    invitationMessagePreview(
      "Antes {{link}} Después en la encuesta",
      "https://example.test/personal",
    ),
    "Abre tu invitación:\nhttps://example.test/personal\n\nAntes  Después en la encuesta",
  );
  assert.equal(
    invitationMessagePreview("", "https://example.test/personal"),
    "Abre tu invitación:\nhttps://example.test/personal\n\n👇 Por favor, responde en la encuesta de aquí abajo para confirmar tu asistencia.",
  );
});
