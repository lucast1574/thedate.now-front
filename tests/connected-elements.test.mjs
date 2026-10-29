import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { invitationTemplates } = loadSource(
  "src/lib/events/template-catalog.ts",
);
const { templateSequence } = loadSource(
  "src/features/designer/template-sequence.ts",
  { globals: { crypto } },
);
const { addMissingTemplateElements } = loadSource(
  "src/features/designer/missing-template-elements.ts",
  { globals: { crypto } },
);
const { elementValue } = loadSource("src/lib/events/element-values.ts");
const { visibleInvitationSection } = loadSource(
  "src/lib/events/section-visibility.ts",
);
const { mapCoordinates, validMapCoordinates } = loadSource(
  "src/lib/events/map-element.ts",
);
const { weddingContent } = loadSource("src/lib/events/product-content.ts");
const { validInvitationSlug } = loadSource("src/lib/events/domains.ts");
const source = {
  id: "test",
  kind: "wedding",
  title: "Boda de verano",
  photoKeys: [],
  sections: [],
  description: "",
  template: "classic",
  accentColor: "#765432",
  startAt: "2027-01-01T23:00:00Z",
  timeZone: "America/Lima",
  location: "Lugar nuevo",
  mapUrl: "https://www.google.com/maps/@-12.1,-77.2,16z",
  celebration: {
    partnerOne: "Ana",
    partnerTwo: "Luis",
    dressCode: "Formal",
    dressNote: "Sin blanco",
    restrictionText: "Sin mascotas",
  },
};
test("both products ship every essential connected element including an inactive wishlist", () => {
  for (const template of invitationTemplates.filter(
    (t) => t.mode === "flyer",
  )) {
    const pages = templateSequence(template, {
      ...source,
      kind: template.kind,
    });
    const elements = pages.flatMap((p) => p.canvas.elements);
    for (const binding of [
      template.kind === "wedding" ? "couple_names" : "event_title",
      "guest_name",
      "event_date",
      "location",
      "dress_code",
      "gift_link",
      "restrictions",
    ])
      assert.ok(
        elements.some((e) => e.binding === binding),
        `${template.id}: ${binding}`,
      );
    assert.equal(
      elements.find((e) => e.binding === "gift_link").link,
      "/regalos",
    );
    assert.equal(
      visibleInvitationSection(
        pages.find((p) => p.when === "gifts"),
        source,
      ),
      false,
    );
  }
});
test("bound values follow event edits while existing independent designs stay unchanged", () => {
  assert.equal(
    elementValue(
      { binding: "couple_names", eventBound: true, text: "Antes" },
      source,
    ).text,
    "Ana y Luis",
  );
  assert.equal(
    elementValue(
      { binding: "location", eventBound: true, address: "Antes" },
      source,
    ).address,
    "Lugar nuevo",
  );
  assert.match(
    elementValue({ binding: "event_date", eventBound: true }, source).text,
    /2027/,
  );
  const custom = { binding: "dress_code", text: "Mi texto", eventBound: false };
  assert.equal(elementValue(custom, source), custom);
  assert.equal(
    visibleInvitationSection(
      { when: "restrictions" },
      { ...source, celebration: { restrictionText: "" } },
    ),
    false,
  );
  assert.equal(
    visibleInvitationSection(
      { when: "gifts" },
      { ...source, wishlistEnabled: true },
    ),
    true,
  );
});
test("adding missing elements preserves personalized sections and is idempotent", () => {
  const original = {
    ...source,
    sections: [
      {
        id: "custom",
        heading: "Mi diseño",
        canvas: { elements: [{ id: "mine", type: "text", text: "Conservar" }] },
      },
    ],
  };
  const template = invitationTemplates.find(
    (t) => t.kind === "wedding" && t.mode === "flyer",
  );
  const result = addMissingTemplateElements(original, template);
  assert.equal(result.sections[0], original.sections[0]);
  assert.ok(result.sections.length > 1);
  assert.equal(
    addMissingTemplateElements(result, template).sections.length,
    result.sections.length,
  );
});
test("maps use explicit valid coordinates and reject a bogus location", () => {
  const coords = mapCoordinates(source.mapUrl);
  assert.equal(coords.mapLatitude, -12.1);
  assert.equal(coords.mapLongitude, -77.2);
  assert.equal(validMapCoordinates(coords), true);
  assert.equal(
    validMapCoordinates({ mapLatitude: 200, mapLongitude: 5 }),
    false,
  );
  assert.equal(
    validMapCoordinates(mapCoordinates("https://maps.app.goo.gl/sample")),
    false,
  );
});
test("The Date accepts general occasions and identifies explicit wedding intent", () => {
  for (const slug of ["save", "SAVE", "save.thedate.now", "save--date"])
    assert.equal(validInvitationSlug(slug), false);
  assert.equal(validInvitationSlug("cumple-javier"), true);
  for (const title of [
    "Cumpleaños de Javier",
    "Bautizo de Sofía",
    "Fiesta de empresa",
  ])
    assert.equal(weddingContent(title), false);
  for (const title of ["Nuestra boda", "Nos casamos", "WEDDING de Ana y Luis"])
    assert.equal(weddingContent(title), true);
});
