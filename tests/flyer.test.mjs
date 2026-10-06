import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const globals = { crypto: { randomUUID } };
const { moveElement, resizeElement, flyerSections } = loadSource(
  "src/features/designer/flyer/canvas-model.ts",
  { globals },
);
const { applyTemplate } = loadSource("src/features/designer/templates.ts", {
  globals,
});
const { invitationTemplates } = loadSource(
  "src/lib/events/template-catalog.ts",
  { globals },
);
const { default: Invitation } = loadSource(
  "src/features/invitations/invitation.tsx",
);
const { parseGuestCSV } = loadSource("src/lib/events/guest-csv.ts");
const event = {
  id: "id",
  kind: "wedding",
  slug: "our-day",
  title: "Ana & Luis",
  description: "Nuestra historia",
  accentColor: "#9c6449",
  template: "classic",
  photoKeys: ["ours.png"],
  startAt: "2027-01-01T18:00:00Z",
  timeZone: "America/Lima",
  location: "Lima",
  organizer: "Ana",
  isVirtual: false,
  mapUrl: "",
  virtualUrl: "",
  sections: [
    {
      id: "history",
      heading: "Historia",
      body: "Texto que conservar",
      icon: "heart",
      photoKey: "ours.png",
    },
  ],
};
test("canvas moves and resizes stay inside its coordinate space", () => {
  const canvas = { width: 720, height: 960 };
  const item = { x: 70, y: 100, width: 200, height: 200 };
  const moved = moveElement(item, 900, -900, canvas);
  assert.equal(moved.x, 520);
  assert.equal(moved.y, 0);
  const resized = resizeElement(item, 900, -10, canvas);
  assert.equal(resized.width, 650);
  assert.equal(resized.height, 16);
});
test("each product has both template modes and applying a theme retains content", () => {
  for (const kind of ["wedding", "general"]) {
    for (const mode of ["sections", "flyer"]) {
      const choices = invitationTemplates.filter(
        (t) => t.kind === kind && t.mode === mode,
      );
      assert.ok(choices.length >= 2);
      for (const template of choices) {
        const themed = applyTemplate({ ...event, kind }, template);
        assert.equal(themed.title, event.title);
        assert.equal(themed.description, event.description);
        assert.equal(themed.sections[0].body, event.sections[0].body);
        assert.equal(themed.sections[0].photoKey, "ours.png");
        assert.equal(themed.designMode, mode);
        if (mode === "flyer")
          assert.ok(themed.sections.every((section) => section.canvas));
      }
    }
  }
});
test("flyer mode preserves custom layers across mode changes and theme applications", () => {
  const sections = flyerSections(event);
  sections[0].canvas.elements[0].rotation = 45;
  const flyer = { ...event, sections, designMode: "flyer" };
  const themed = applyTemplate(
    flyer,
    invitationTemplates.find((t) => t.kind === "wedding" && t.mode === "flyer"),
  );
  assert.equal(themed.sections[0].canvas.elements[0].rotation, 45);
  assert.equal(
    flyerSections({ ...themed, designMode: "sections" })[0].canvas.elements[0]
      .id,
    sections[0].canvas.elements[0].id,
  );
});
test("public and editor invitation renderer share flyer geometry and escaped text", () => {
  const sections = flyerSections(event);
  sections[0].canvas.elements[0].text = "<img src=x onerror=alert(1)>";
  sections[0].canvas.elements[0].rotation = 30;
  const html = renderToStaticMarkup(
    createElement(Invitation, {
      event: { ...event, sections, designMode: "flyer" },
      photoURL: (key) => `/private/${key}`,
    }),
  );
  assert.match(html, /flyer-surface/);
  assert.match(html, /rotate\(30deg\)/);
  assert.match(html, /&lt;img/);
  assert.match(html, /\/private\/ours.png/);
  assert.doesNotMatch(html, /<img src=x/);
});
test("guest CSV supports quoted names and validates the complete list before upload", () => {
  const guests = parseGuestCSV(
    '\ufeffnombre,telefono,cupos\r\n"Ana, Luis",+51999999999,2\r\n"Laura ""Lau""",+51999999998,1',
  );
  assert.equal(guests[0].name, "Ana, Luis");
  assert.equal(guests[1].name, 'Laura "Lau"');
  assert.throws(
    () => parseGuestCSV("nombre,telefono,cupos\nAna,99999,2"),
    /fila 2/,
  );
  assert.throws(
    () => parseGuestCSV("nombre,telefono,cupos\nAna,+51999999999,0"),
    /fila 2/,
  );
  assert.throws(
    () => parseGuestCSV('nombre,telefono\n"Ana,+51999999999'),
    /comillas/,
  );
});
