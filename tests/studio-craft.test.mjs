import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const options = { globals: { crypto } };
const { fitInvitationText } = loadSource(
  "src/lib/events/fit-invitation-text.ts",
);
const { invitationTemplates } = loadSource(
  "src/lib/events/template-catalog.ts",
);
const { templateSequence } = loadSource(
  "src/features/designer/template-sequence.ts",
  options,
);
const { editableOrnaments } = loadSource(
  "src/features/designer/editable-ornaments.ts",
  options,
);
const { canvasCommand } = loadSource(
  "src/features/designer/flyer/canvas-commands.ts",
);
const { applyCompleteTemplate } = loadSource(
  "src/features/designer/apply-template-design.ts",
  options,
);
const { blankEvent } = loadSource("src/lib/events/draft.ts");
test("headlines fit their longest word; spacing and line height participate in fitting", () => {
  const item = {
    type: "text",
    text: "CELEBREMOS JUNTOS",
    width: 624,
    height: 360,
    fontSize: 132,
    font: "sans",
    bold: true,
  };
  const size = fitInvitationText(item);
  assert.ok(size * 0.78 * "CELEBREMOS".length <= item.width);
  assert.ok(fitInvitationText({ ...item, letterSpacing: 0.3 }) < size);
  assert.ok(
    fitInvitationText({ ...item, height: 150, lineHeight: 2.4 }) <
      fitInvitationText({ ...item, height: 150 }),
  );
});
test("all templates have individually editable art and preserve the element budget", () => {
  for (const template of invitationTemplates.filter(
    (t) => t.mode === "flyer",
  )) {
    for (const { canvas } of templateSequence(template)) {
      assert.equal(canvas.artEditable, true, template.id);
      assert.ok(canvas.elements.length <= 60);
      const art = canvas.elements.find((item) => item.icon?.startsWith("art:"));
      assert.ok(art, template.id);
      assert.equal(editableOrnaments(canvas), canvas);
      const removed = canvasCommand(canvas, art.id, "delete");
      assert.ok(!removed.elements.some((item) => item.id === art.id));
      assert.equal(removed.artEditable, true);
    }
  }
});
test("switching collections does not accumulate generated decoration or lose photo framing", () => {
  const templates = invitationTemplates.filter(
    (t) => t.kind === "wedding" && t.mode === "flyer",
  );
  let draft = applyCompleteTemplate(blankEvent("wedding"), templates[0]);
  const photo = draft.sections
    .flatMap((s) => s.canvas.elements)
    .find((e) => e.type === "image");
  photo.photoPositionX = 0;
  photo.photoPositionY = 100;
  for (const template of templates.slice(1, 7)) {
    draft = applyCompleteTemplate(draft, template);
    for (const section of draft.sections)
      assert.ok(
        section.canvas.elements.filter((e) => e.id.startsWith("ornament-"))
          .length <= 2,
      );
  }
  assert.ok(
    draft.sections
      .flatMap((s) => s.canvas.elements)
      .some(
        (e) =>
          e.type === "image" &&
          e.photoPositionX === 0 &&
          e.photoPositionY === 100,
      ),
  );
});
