import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { preparationProgress } = loadSource(
  "src/lib/events/preparation-progress.ts",
);
const Progress = loadSource(
  "src/features/manager/delivery-progress.tsx",
).default;
test("preparation progresses by reported milestones and completes only on verified readiness", () => {
  const stages = ["pending", "configured", "deploying", "verifying", "ready"];
  const values = stages.map((phase) => preparationProgress(phase).percent);
  assert.deepEqual(values, [10, 35, 70, 90, 100]);
  for (const phase of [undefined, "unknown", "error"])
    assert.equal(preparationProgress(phase).percent, 0);
});
test("verification activates the link step and reports an estimated percentage without marking sends complete", () => {
  const html = renderToStaticMarkup(
    React.createElement(Progress, {
      phase: "preparing",
      delivery: {
        phase: "preparing",
        deploymentPhase: "verifying",
        total: 5,
        sent: 0,
        waiting: 5,
        failed: 0,
        uncertain: 0,
      },
    }),
  );
  assert.match(html, /90%/);
  assert.match(html, /avance estimado/);
  assert.match(html, /aria-valuetext="90% estimado/);
  assert.match(
    html,
    /data-state="active" aria-current="step"[\s\S]*?Comprobamos el enlace/,
  );
  assert.match(html, /0<\/b> de 5 enviadas/);
});
