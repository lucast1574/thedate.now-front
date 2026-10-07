import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { default: EventForm } = loadSource("src/features/studio/event-form.tsx");
const { default: SectionWorkspace } = loadSource(
  "src/features/designer/section-workspace.tsx",
);
const { blankEvent } = loadSource("src/lib/events/draft.ts");
test("event setup starts without optional template controls in either product", () => {
  for (const kind of ["wedding", "general"]) {
    const html = renderToStaticMarkup(
      createElement(EventForm, {
        draft: blankEvent(kind),
        setDraft() {},
        selected: null,
        busy: false,
        onSubmit() {},
      }),
    );
    assert.doesNotMatch(
      html,
      /Estilo de tu invitación|Elegir color|color-picker|style-options/,
    );
    assert.match(html, /Mensaje y estilo/);
    assert.match(html, /Empezar con una plantilla/);
    const existing = renderToStaticMarkup(
      createElement(EventForm, {
        draft: blankEvent(kind),
        setDraft() {},
        selected: blankEvent(kind),
        busy: false,
        onSubmit() {},
      }),
    );
    assert.doesNotMatch(
      existing,
      /Empezar con una plantilla|style-options|color-picker/,
    );
    assert.match(html, /Crear mi invitación/);
  }
});
test("template customization belongs to the editor and needs an applied template", () => {
  for (const kind of ["wedding", "general"]) {
    const draft = blankEvent(kind);
    const editor = {
      draft,
      sections: [],
      setDraft() {},
      addSection() {},
      addGuestSection() {},
    };
    const applied = renderToStaticMarkup(
      createElement(SectionWorkspace, { editor }),
    );
    assert.match(applied, /Personalizar plantilla/);
    assert.match(applied, /color-picker/);
    const free = renderToStaticMarkup(
      createElement(SectionWorkspace, {
        editor: { ...editor, draft: { ...draft, templateId: undefined } },
      }),
    );
    assert.doesNotMatch(free, /Personalizar plantilla|color-picker/);
  }
});

const { default: GuestHoldField } = loadSource(
  "src/features/studio/guest-hold-field.tsx",
);
test("waiting period explains reservations and preserves custom saved hours", () => {
  for (const hours of [48, 37]) {
    const html = renderToStaticMarkup(
      createElement(GuestHoldField, {
        draft: { ...blankEvent("general"), maybeHoldHours: hours },
        setDraft() {},
      }),
    );
    assert.match(html, /desde su respuesta/);
    assert.match(html, /el lugar se libera/);
    if (hours === 37) assert.match(html, /value="37"/);
    else {
      assert.match(html, /2 días/);
      assert.doesNotMatch(html, /type="number"/);
    }
  }
});
