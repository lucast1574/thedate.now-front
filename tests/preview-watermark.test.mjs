import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { default: DesignPreview } = loadSource(
  "src/features/designer/design-preview.tsx",
);
test("free previews visibly carry the product watermark while paid and courtesy previews do not", () => {
  for (const kind of ["wedding", "general"]) {
    const unpaid = renderToStaticMarkup(
      createElement(DesignPreview, {
        draft: { id: "event", kind, paymentStatus: "unpaid" },
      }),
    );
    assert.match(unpaid, /preview-watermark/);
    assert.match(unpaid, kind === "wedding" ? /Save the Date/ : /The Date/);
    const paid = renderToStaticMarkup(
      createElement(DesignPreview, {
        draft: {
          id: "event",
          kind,
          paymentStatus: "paid",
          paymentSource: "courtesy",
        },
      }),
    );
    assert.doesNotMatch(paid, /preview-watermark/);
    const demo = renderToStaticMarkup(
      createElement(DesignPreview, {
        draft: { id: "event", kind, paymentStatus: "demo", isDemo: true },
      }),
    );
    assert.match(demo, /preview-watermark/);
  }
});
