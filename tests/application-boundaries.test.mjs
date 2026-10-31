import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadSource } from "./support/load-source.cjs";

function routes(root) {
  return fs
    .readdirSync(root, { recursive: true })
    .filter((file) => /\b(page|route)\.tsx?$/.test(file))
    .sort();
}
test("both applications expose the same functions through shared routes", () => {
  const general = "apps/the-date/src/app",
    wedding = "apps/save-the-date/src/app";
  assert.deepEqual(routes(general), routes(wedding));
  for (const file of routes(general).filter(
    (file) => !file.includes("application-health"),
  )) {
    const one = fs.readFileSync(path.join(general, file), "utf8");
    assert.equal(
      one.split(";", 1)[0],
      fs.readFileSync(path.join(wedding, file), "utf8").split(";", 1)[0],
    );
    assert.match(one, /@\/app\//);
  }
});
test("each application owns its product stylesheet and initial server identity", () => {
  for (const [name, kind, other] of [
    ["the-date", "general", "wedding"],
    ["save-the-date", "wedding", "general"],
  ]) {
    const base = `apps/${name}`;
    assert.match(
      fs.readFileSync(`${base}/src/app/globals.css`, "utf8"),
      new RegExp(`products/${kind}\\.css`),
    );
    assert.doesNotMatch(
      fs.readFileSync(`${base}/src/app/globals.css`, "utf8"),
      new RegExp(`products/${other}\\.css`),
    );
    assert.match(
      fs.readFileSync(`${base}/src/app/layout.tsx`, "utf8"),
      new RegExp(`product="${kind}"`),
    );
    assert.match(
      fs.readFileSync(`${base}/next.config.ts`, "utf8"),
      new RegExp(`APP_PRODUCT: "${kind}"`),
    );
  }
});
test("24 complete templates per product never insert media from the user's library", () => {
  const { invitationTemplates } = loadSource(
    "src/lib/events/template-catalog.ts",
  );
  const { applyCompleteTemplate } = loadSource(
    "src/features/designer/apply-template-design.ts",
    { globals: { crypto } },
  );
  for (const kind of ["general", "wedding"]) {
    const catalog = invitationTemplates.filter(
      (item) => item.kind === kind && item.mode === "flyer",
    );
    assert.equal(catalog.length, 24);
    for (const template of catalog) {
      const library = ["private-portrait.jpg", "private-family.jpg"];
      const result = applyCompleteTemplate(
        {
          id: "draft",
          kind,
          title: "Nuestra celebración",
          description: "",
          template: "classic",
          accentColor: "#89664b",
          photoKeys: library,
          backgroundImage: { photoKey: library[0] },
        },
        template,
      );
      assert.equal(result.photoKeys, library);
      assert.equal(result.backgroundImage.photoKey, library[0]);
      for (const item of result.sections.flatMap(
        (page) => page.canvas.elements,
      )) {
        if (item.type === "image")
          assert.equal(item.photoKey, "template-photo");
      }
    }
  }
});
test("preview styles finish loading before content becomes available", async () => {
  const { preparePreviewDocument } = loadSource(
    "src/features/designer/prepare-preview-document.ts",
  );
  const pending = [];
  const link = () => ({
    cloneNode: () => ({
      tagName: "LINK",
      addEventListener: (name, fn) => {
        if (name === "load") pending.push(fn);
      },
    }),
  });
  const source = {
    documentElement: { className: "font-sans" },
    querySelectorAll: () => [link(), link()],
  };
  const doc = {
    documentElement: { dataset: {} },
    head: { appendChild() {} },
    body: { ready: true },
  };
  let mounted = false;
  const ready = preparePreviewDocument(doc, source, "general").then(() => {
    mounted = true;
  });
  assert.equal(doc.documentElement.dataset.product, "general");
  assert.equal(mounted, false);
  pending[0]();
  await Promise.resolve();
  assert.equal(mounted, false);
  pending[1]();
  await ready;
  assert.equal(mounted, true);
});
