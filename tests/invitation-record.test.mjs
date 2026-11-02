import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

const Record = loadSource("src/features/designer/invitation-record.tsx", {
  mocks: {
    "next/link": {
      default: ({ children, ...props }) =>
        React.createElement("a", props, children),
    },
    "./design-preview": {
      default: ({ downloadable }) =>
        React.createElement("section", { "data-downloadable": downloadable }),
    },
  },
}).default;

test("both invitation records keep account navigation and event records without edit actions", () => {
  for (const kind of ["general", "wedding"]) {
    const markup = renderToStaticMarkup(
      React.createElement(Record, {
        user: { id: "owner", name: "Ana", role: "user" },
        event: {
          id: "past event",
          kind,
          title: "Una celebración especial",
          startAt: "2020-06-10T18:00:00Z",
          timeZone: "America/Bogota",
        },
      }),
    );
    assert.match(markup, /workspace-sidebar/);
    assert.match(markup, /href="\/profile"/);
    assert.match(markup, /href="\/support"/);
    assert.equal((markup.match(/href="\/"/g) || []).length >= 2, true);
    for (const tab of ["guests", "tables", "gifts"]) {
      assert.ok(markup.includes(`/manager/past%20event?tab=${tab}`));
    }
    assert.match(markup, /data-downloadable="true"/);
    assert.match(markup, /Una celebración especial/);
    assert.doesNotMatch(
      markup,
      /<form|Guardar cambios|Editar invitación|Cerrar sesión|cerrad|caduc|vencid/i,
    );
  }
});
