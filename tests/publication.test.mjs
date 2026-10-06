import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { default: Panel } = loadSource(
  "src/features/studio/publication-panel.tsx",
);
const { default: Subdomain } = loadSource(
  "src/features/studio/subdomain-field.tsx",
);
test("both products withhold public links until the matching page is verified", () => {
  for (const kind of ["wedding", "general"]) {
    const host = `sofiaymateo.${kind === "wedding" ? "save." : ""}thedate.now`;
    const selected = {
      id: "event",
      kind,
      slug: "sofiaymateo",
      paymentStatus: "paid",
      publishedAt: "2026-10-06T12:00:00Z",
    };
    const render = (deployment) =>
      renderToStaticMarkup(
        createElement(Panel, {
          selected,
          deployment,
          busy: false,
          paymentsEnabled: true,
          checkout() {},
          publish() {},
        }),
      );
    for (const phase of [
      "pending",
      "configured",
      "deploying",
      "verifying",
      "error",
    ]) {
      const html = render({ eventId: "event", host, phase });
      assert.doesNotMatch(html, /href=/);
      assert.doesNotMatch(html, /sofiaymateo\.(save\.)?thedate\.now/);
      if (phase !== "error") {
        assert.match(html, /role="status"/);
        assert.match(html, /disponible en internet/);
      }
      assert.doesNotMatch(html, /configured|verifying|Docker|Swarm|Dokploy/);
    }
    assert.doesNotMatch(render(null), /href=/);
    assert.doesNotMatch(
      render({ eventId: "event", host: "another.thedate.now", phase: "ready" }),
      /href=/,
    );
    assert.match(
      render({ eventId: "event", host, phase: "ready" }),
      new RegExp(`href="https://${host.replaceAll(".", "\\.")}`),
    );
    selected.publishedAt = null;
    assert.doesNotMatch(
      render({ eventId: "event", host, phase: "ready" }),
      /href=/,
    );
  }
});
test("subdomain choice shows the product suffix and usable help for touch and keyboard", () => {
  for (const kind of ["wedding", "general"]) {
    const html = renderToStaticMarkup(
      createElement(Subdomain, {
        kind,
        value: "",
        disabled: false,
        onChange() {},
      }),
    );
    assert.match(html, /Elige tu subdominio/);
    assert.match(html, /aria-describedby="subdomain-hint subdomain-address"/);
    assert.match(html, /<details/);
    assert.match(html, /sin espacios/);
    assert.match(
      html,
      kind === "wedding"
        ? /sofiaymateo.save.thedate.now/
        : /cumplelucas.thedate.now/,
    );
  }
});
