import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { FlyerContent } = loadSource("src/components/flyer-surface.tsx");
const { validDressColors } = loadSource("src/lib/events/dress-code.ts");
const { designPayload } = loadSource("src/features/designer/design-state.ts");
const { sameDesign } = loadSource("src/features/designer/design-state.ts");
test("dress code prints forbidden colors with names and crossed swatches in the shared canvas renderer", () => {
  const item = {
    type: "text",
    binding: "dress_code",
    text: "Elegante",
    dressStyle: "icon-text",
    dressExcludedColors: [
      { name: "Blanco", color: "#FFFFFF" },
      { name: "Marfil", color: "#F5EFE2" },
    ],
  };
  const html = renderToStaticMarkup(
    createElement(FlyerContent, { item, photoURL: () => "" }),
  );
  for (const text of [
    "Elegante",
    "Colores no permitidos",
    "Blanco",
    "Marfil",
    "dress-excluded-swatch",
  ])
    assert.ok(html.includes(text), text);
  assert.match(html, /background:#FFFFFF/);
  item.dressExcludedColors = [];
  assert.ok(
    !renderToStaticMarkup(
      createElement(FlyerContent, { item, photoURL: () => "" }),
    ).includes("Colores no permitidos"),
  );
});
test("restrictions independently render icon, editable text or both without adding event rules", () => {
  for (const style of ["icon", "text", "icon-text"]) {
    const item = {
      type: "text",
      binding: "restrictions",
      restrictionStyle: style,
      restrictionIcon: "lucide:paw-print",
      text: "El lugar no admite mascotas.",
    };
    const html = renderToStaticMarkup(
      createElement(FlyerContent, { item, photoURL: () => "" }),
    );
    assert.equal(
      html.includes("restriction-composition-icon"),
      style !== "text",
    );
    assert.equal(
      html.includes("El lugar no admite mascotas."),
      style !== "icon",
    );
    assert.ok(!html.includes("Solo adultos"));
  }
});
test("invalid or oversized dress color rules are caught before saving", () => {
  assert.ok(validDressColors(undefined));
  assert.ok(validDressColors([{ name: "Blanco", color: "#FFFFFF" }]));
  for (const rules of [
    [{ name: " ", color: "#FFFFFF" }],
    [{ name: "Blanco", color: "red" }],
    Array.from({ length: 9 }, () => ({ name: "Blanco", color: "#FFFFFF" })),
  ])
    assert.equal(validDressColors(rules), false);
});
test("design payload preserves color exclusions and each restriction's independent icon and text", () => {
  const elements = [
    {
      id: "dress",
      type: "text",
      binding: "dress_code",
      dressExcludedColors: [{ name: "Marfil", color: "#F5EFE2" }],
    },
    {
      id: "rule",
      type: "text",
      binding: "restrictions",
      restrictionIcon: "lucide:camera-off",
      restrictionStyle: "icon-text",
      text: "Sin fotografías durante la ceremonia.",
    },
  ];
  const draft = {
    id: "event",
    kind: "wedding",
    template: "classic",
    designMode: "flyer",
    sections: [{ id: "page", canvas: { elements } }],
  };
  const saved = JSON.parse(JSON.stringify(designPayload(draft)));
  assert.deepEqual(saved.sections[0].canvas.elements, elements);
});
test("removing the final forbidden color matches the API's omitted empty list", () => {
  const base = {
    id: "event",
    kind: "wedding",
    template: "classic",
    designMode: "flyer",
  };
  const draft = {
    ...base,
    sections: [
      {
        id: "page",
        canvas: {
          elements: [
            {
              id: "dress",
              type: "text",
              binding: "dress_code",
              dressExcludedColors: [],
            },
          ],
        },
      },
    ],
  };
  const stored = JSON.parse(JSON.stringify(draft));
  delete stored.sections[0].canvas.elements[0].dressExcludedColors;
  assert.equal(sameDesign(draft, stored), true);
});
