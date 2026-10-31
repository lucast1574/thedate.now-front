import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { initialInvitation } = loadSource(
  "src/features/studio/initial-invitation.ts",
  { globals: { crypto } },
);
const { blankEvent } = loadSource("src/lib/events/draft.ts");
const { invitationTemplates } = loadSource(
  "src/lib/events/template-catalog.ts",
);
const { templateOpening } = loadSource(
  "src/features/designer/template-extras.ts",
);
const { applyCompleteTemplate } = loadSource(
  "src/features/designer/apply-template-design.ts",
  { globals: { crypto } },
);

test("every initial canvas template saves the preview with current features atomically", () => {
  for (const template of invitationTemplates.filter(
    (t) => t.mode === "flyer",
  )) {
    const draft = {
      ...blankEvent(template.kind),
      title: "Una gran celebración",
      slug: "celebracion",
      startAt: "2027-06-19T18:00:00Z",
      timeZone: "America/Lima",
      organizer: "Lucas",
      location: "Lima",
      mapUrl: "https://maps.google.com/?q=Lima",
      template: template.style,
      templateId: template.id,
      accentColor: template.accent,
      creation: {
        dressExcludedColors: [{ name: "Blanco", color: "#FFFFFF" }],
        restrictionText: "El lugar no admite mascotas.",
        restrictionIcon: "lucide:paw-print",
      },
    };
    const payload = initialInvitation(draft);
    const design = payload.initialDesign;
    assert.equal(design.templateId, template.id);
    assert.equal(design.title, payload.title);
    assert.equal(design.opening.style, templateOpening(template).style);
    assert.equal(design.opening.paletteMode, "design");
    const elements = design.sections.flatMap((s) => s.canvas.elements);
    const dress = elements.find((e) => e.binding === "dress_code");
    assert.equal(dress.dressStyle, "icon-text");
    assert.equal(dress.dressExcludedColors[0].name, "Blanco");
    assert.equal(
      elements.find((e) => e.binding === "restrictions").restrictionIcon,
      "lucide:paw-print",
    );
    assert.equal(payload.creation, undefined);
    assert.equal(draft.sections, undefined);
  }
});
test("virtual templates use their join link and configured openings survive", () => {
  const draft = {
    ...blankEvent("general"),
    title: "Celebración online",
    startAt: "2027-06-19T18:00:00Z",
    isVirtual: true,
    virtualUrl: "https://meet.google.com/example",
    opening: {
      ...templateOpening(invitationTemplates.find((t) => t.mode === "flyer")),
      enabled: false,
    },
  };
  const result = initialInvitation(draft);
  const location = result.initialDesign.sections
    .flatMap((s) => s.canvas.elements)
    .find((e) => e.binding === "location");
  assert.equal(location.link, draft.virtualUrl);
  assert.equal(result.initialDesign.opening.enabled, false);
});

test("changing templates carries editable restrictions, color exclusions and active gift access", () => {
  const template = invitationTemplates.find(
    (t) => t.mode === "flyer" && t.kind === "wedding",
  );
  const first = initialInvitation({
    ...blankEvent("wedding"),
    title: "Ana y Luis",
    startAt: "2027-06-19T18:00:00Z",
    creation: {
      dressExcludedColors: [{ name: "Marfil", color: "#F5EFE2" }],
      restrictionText: "Sin mascotas",
      restrictionIcon: "lucide:paw-print",
    },
  }).initialDesign;
  const source = { ...blankEvent("wedding"), ...first, wishlistEnabled: true };
  const next = applyCompleteTemplate(source, template);
  const elements = next.sections.flatMap((s) => s.canvas.elements);
  assert.equal(elements.filter((e) => e.binding === "restrictions").length, 1);
  assert.equal(
    elements.find((e) => e.binding === "restrictions").text,
    "Sin mascotas",
  );
  assert.equal(
    elements.find((e) => e.binding === "dress_code").dressExcludedColors[0]
      .name,
    "Marfil",
  );
  assert.equal(elements.filter((e) => e.binding === "gift_link").length, 1);
});

// Form defaults must survive even when a dress element is added later.
test("event payload persists dress defaults and private WhatsApp copy independently", () => {
  const { eventPayload, blankEvent } = loadSource("src/lib/events/draft.ts");
  const draft = {
    ...blankEvent("wedding"),
    startAt: "2026-12-01T18:00",
    description: "Visible on the design",
    invitationMessage: "Confirma aquí: {{enlace}}",
  };
  draft.celebration.dressExcludedColors = [
    { name: "Blanco", color: "#FFFFFF" },
  ];
  const payload = eventPayload(draft);
  assert.deepEqual(
    payload.celebration.dressExcludedColors,
    draft.celebration.dressExcludedColors,
  );
  assert.equal(payload.invitationMessage, "Confirma aquí: {{link}}");
  assert.equal(payload.description, draft.description);
});

test("all 48 templates load saved dress, restrictions and adults-only choices", () => {
  for (const template of invitationTemplates.filter(
    (item) => item.mode === "flyer",
  )) {
    const draft = {
      ...blankEvent(template.kind),
      templateId: template.id,
      template: template.style,
      accentColor: template.accent,
      startAt: "2026-12-01T18:00",
    };
    draft.celebration = {
      ...draft.celebration,
      adultsOnly: true,
      adultsMessage: "Solo mayores de edad.",
      dressCode: "Formal",
      dressNote: "Traje oscuro.",
      dressExcludedColors: [{ name: "Marfil", color: "#F5EFE2" }],
      restrictionText: "Sin mascotas.",
      restrictionIcon: "lucide:paw-print",
    };
    const payload = initialInvitation(draft);
    const elements = payload.initialDesign.sections.flatMap(
      (section) => section.canvas?.elements || [],
    );
    const dress = elements.find((item) => item.binding === "dress_code");
    const rule = elements.find((item) => item.binding === "restrictions");
    assert.match(dress.text, /Formal/);
    assert.deepEqual(
      dress.dressExcludedColors,
      draft.celebration.dressExcludedColors,
    );
    assert.equal(rule.text, "Sin mascotas.");
    assert.equal(rule.restrictionIcon, "lucide:paw-print");
    assert.ok(
      elements.some(
        (item) =>
          item.binding === "adults_notice" &&
          item.text === "Solo mayores de edad.",
      ),
    );
    assert.equal(payload.celebration.restrictionText, "Sin mascotas.");
  }
});
test("new restrictions preload saved text, icon and adults-only notice", () => {
  const { restrictionDefaults } = loadSource("src/lib/events/restrictions.ts");
  const draft = blankEvent("wedding");
  draft.celebration = {
    ...draft.celebration,
    adultsOnly: true,
    adultsMessage: "Solo adultos.",
    restrictionText: "Sin mascotas.",
    restrictionIcon: "lucide:paw-print",
  };
  const defaults = restrictionDefaults(draft);
  assert.equal(defaults.text, "Solo adultos.\n\nSin mascotas.");
  assert.equal(defaults.restrictionIcon, "lucide:paw-print");
});

test("fixed link markers cannot be persisted as duplicate user-authored links", () => {
  const { eventPayload } = loadSource("src/lib/events/draft.ts");
  const payload = eventPayload({
    ...blankEvent("wedding"),
    startAt: "2026-12-01T18:00",
    invitationMessage: "Confirma aquí: {{link}} {{enlace}}",
  });
  assert.equal(payload.invitationMessage, "Confirma aquí: {{link}}");
});

test("an empty WhatsApp message persists only the protected link marker", () => {
  const { eventPayload } = loadSource("src/lib/events/draft.ts");
  assert.equal(
    eventPayload({
      ...blankEvent("general"),
      startAt: "2026-12-01T18:00",
      invitationMessage: "",
    }).invitationMessage,
    "{{link}}",
  );
});
test("every canvas template carries the venue name and address into its location element", () => {
  for (const template of invitationTemplates.filter(
    (item) => item.mode === "flyer",
  )) {
    const draft = {
      ...blankEvent(template.kind),
      templateId: template.id,
      template: template.style,
      accentColor: template.accent,
      startAt: "2026-12-01T18:00",
      location: "Villa Luis Adolfo II · Huanchaco, Trujillo, Perú",
      mapUrl: "https://maps.app.goo.gl/example",
    };
    const payload = initialInvitation(draft);
    const location = payload.initialDesign.sections
      .flatMap((section) => section.canvas?.elements || [])
      .find((item) => item.binding === "location");
    assert.equal(location.address, draft.location);
    assert.equal(location.link, draft.mapUrl);
  }
});
