import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { default: Sidebar } = loadSource(
  "src/features/studio/workspace-sidebar.tsx",
);
const { default: EventForm } = loadSource(
  "src/features/studio/event-form.tsx",
  { globals: { crypto } },
);
const { blankEvent } = loadSource("src/lib/events/draft.ts");
test("only professionals and admins see the shared celebrations sidebar", () => {
  for (const wedding of [false, true]) {
    const user = {
      id: "one",
      name: "One",
      email: "one@example.test",
      role: "user",
    };
    const html = (role) =>
      renderToStaticMarkup(
        createElement(Sidebar, {
          wedding,
          user: { ...user, role },
          active: "events",
        }),
      );
    assert.doesNotMatch(html("user"), /href="\/compartir"/);
    assert.match(html(wedding ? "planner" : "organizer"), /href="\/compartir"/);
    assert.match(html("admin"), /href="\/compartir"/);
    assert.doesNotMatch(
      html(wedding ? "organizer" : "planner"),
      /href="\/compartir"/,
    );
  }
});
test("demo activation form retains the saved design instead of replacing it with a template", () => {
  for (const kind of ["wedding", "general"]) {
    const draft = {
      ...blankEvent(kind),
      id: "demo-saved",
      isDemo: true,
      photoKeys: ["my-own-photo.jpg"],
      sections: [
        {
          id: "mine",
          icon: "none",
          heading: "My design",
          body: "My own wording",
        },
      ],
    };
    const html = renderToStaticMarkup(
      createElement(EventForm, {
        draft,
        setDraft() {},
        selected: null,
        busy: false,
        onSubmit() {},
      }),
    );
    assert.match(html, /Tu diseño viene contigo/);
    assert.match(html, /Ver mi diseño guardado/);
    assert.match(html, /Continuar al pago/);
    assert.doesNotMatch(html, /Explorar los 24 estilos/);
    assert.equal(draft.sections[0].body, "My own wording");
  }
});
