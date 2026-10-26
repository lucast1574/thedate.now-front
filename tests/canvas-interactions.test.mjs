import { webcrypto } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { loadSource } = require("./support/load-source.cjs");
const { element } = loadSource("src/features/designer/flyer/canvas-model.ts", {
  globals: { crypto: webcrypto },
});
const { imagePlacement, resizeCorner, scaleElement, snapCenter } = loadSource(
  "src/features/designer/flyer/canvas-geometry.ts",
);
const { canvasCommand } = loadSource(
  "src/features/designer/flyer/canvas-commands.ts",
);
const canvas = { width: 720, height: 960, background: "#ffffff", elements: [] };
test("portrait and panoramic photos fit completely and centered when inserted", () => {
  for (const [w, h] of [
    [4000, 500],
    [500, 4000],
    [100, 100],
    [0, 0],
  ]) {
    const p = imagePlacement(w, h, canvas);
    assert.ok(p.width <= 720 && p.height <= 960);
    assert.equal(p.x + p.width / 2, 360);
    assert.equal(p.y + p.height / 2, 480);
    assert.ok(Math.abs(p.width / p.height - (w && h ? w / h : 1)) < 1e-10);
  }
});
test("all corners resize images and symbols proportionally within the page", () => {
  for (const type of ["image", "icon"])
    for (const rotation of [-45, 0, 90])
      for (const corner of ["nw", "ne", "sw", "se"])
        for (const delta of [-4000, -30, 80, 4000]) {
          const item = element(type, {
            x: 150,
            y: 200,
            width: 240,
            height: 120,
            rotation,
          });
          const next = resizeCorner(item, delta, delta / 2, corner, canvas);
          const sx = corner.endsWith("e") ? 1 : -1,
            sy = corner.startsWith("s") ? 1 : -1;
          const angle = (rotation * Math.PI) / 180;
          const anchor = (box) => [
            box.x +
              box.width / 2 -
              ((sx * box.width) / 2) * Math.cos(angle) +
              ((sy * box.height) / 2) * Math.sin(angle),
            box.y +
              box.height / 2 -
              ((sx * box.width) / 2) * Math.sin(angle) -
              ((sy * box.height) / 2) * Math.cos(angle),
          ];
          assert.ok(
            anchor(item).every(
              (value, index) => Math.abs(value - anchor(next)[index]) < 1e-8,
            ),
            "opposite corner stays fixed even at a page edge",
          );
          assert.ok(Math.abs(next.width / next.height - 2) < 1e-9);
          assert.ok(
            next.width >= 16 && next.height >= 16 && next.x >= 0 && next.y >= 0,
          );
          assert.ok(
            next.x + next.width <= 720.001 && next.y + next.height <= 960.001,
          );
        }
  const item = element("image", { x: 500, y: 700, width: 200, height: 100 });
  const scaled = scaleElement(item, 1000, "width", canvas);
  assert.equal(scaled.width / scaled.height, 2);
  assert.ok(scaled.width <= 220.00001);
});
test("centering snaps close elements on each axis without moving distant elements", () => {
  const item = element("icon", { x: 309, y: 427, width: 100, height: 100 });
  const snap = snapCenter(item, canvas, 6);
  assert.equal(snap.item.x, 310);
  assert.equal(snap.item.y, 430);
  assert.ok(snap.vertical && snap.horizontal);
  const far = snapCenter({ ...item, x: 100, y: 100 }, canvas, 6);
  assert.equal(far.item.x, 100);
  assert.ok(!far.vertical && !far.horizontal);
});
test("layer commands change actual stacking order, preserve originals and enforce limits", () => {
  const a = element("text", { id: "a" }),
    b = element("text", { id: "b" }),
    c = element("text", { id: "c" });
  const page = { ...canvas, elements: [a, b, c] };
  assert.equal(
    canvasCommand(page, "b", "front")
      .elements.map((x) => x.id)
      .join(),
    "a,c,b",
  );
  assert.equal(
    canvasCommand(page, "b", "back")
      .elements.map((x) => x.id)
      .join(),
    "b,a,c",
  );
  const copy = canvasCommand(page, "b", "duplicate", "copy");
  assert.equal(copy.elements.length, 4);
  assert.equal(copy.elements[2].id, "copy");
  assert.equal(
    canvasCommand(page, "b", "delete")
      .elements.map((x) => x.id)
      .join(),
    "a,c",
  );
  assert.equal(page.elements.length, 3);
  assert.equal(
    canvasCommand(
      { ...page, elements: Array(60).fill(a) },
      "a",
      "duplicate",
      "copy",
    ).elements.length,
    60,
  );
});
test("guest data survives an accidentally missing marker and surrounding text stays customizable", () => {
  const { personalizedText, protectedGuestText } = loadSource(
    "src/lib/events/guest-name.ts",
  );
  assert.equal(
    personalizedText({ binding: "guest_name", text: "Hola" }, "María Rojas"),
    "Hola María Rojas",
  );
  assert.equal(
    personalizedText(
      { binding: "guest_name", text: "Para {{nombre_invitado}}, con amor" },
      "Ana",
    ),
    "Para Ana, con amor",
  );
  assert.equal(
    protectedGuestText("{{nombre_invitado}}"),
    "{{nombre_invitado}}",
  );
});
test("location links preserve exact Google Maps links and safely encode an address fallback", () => {
  const { validMapLink, locationHref } = loadSource(
    "src/lib/events/location-element.ts",
  );
  assert.ok(validMapLink("https://maps.app.goo.gl/example"));
  assert.ok(!validMapLink("javascript:alert(1)"));
  assert.ok(!validMapLink("https://google.com.evil/maps"));
  assert.equal(
    locationHref({
      link: "https://maps.app.goo.gl/example",
      address: "Bogotá",
    }),
    "https://maps.app.goo.gl/example",
  );
  assert.equal(
    new URL(locationHref({ address: "Calle 1 #2 & 3" })).searchParams.get(
      "query",
    ),
    "Calle 1 #2 & 3",
  );
});
test("every suggested symbol exists in the bundled Lucide sprite or the wedding extras", () => {
  const { allSymbols, weddingSymbols, eventSymbols } = loadSource(
    "src/lib/events/symbols.ts",
  );
  const sprite = fs.readFileSync("public/symbols/lucide-1.61.svg", "utf8");
  for (const id of [...weddingSymbols, ...eventSymbols, ...allSymbols])
    assert.ok(
      !id.startsWith("lucide:") || sprite.includes(`id="${id.slice(7)}"`),
      id,
    );
  assert.ok(allSymbols.length > 1800);
  const { allowedInvitationPath } = loadSource(
    "src/lib/events/invitation-runtime.ts",
  );
  assert.ok(allowedInvitationPath("/symbols/lucide-1.61.svg"));
  assert.ok(!allowedInvitationPath("/symbols/private"));
});

test("public images render without cropping and location elements render safe clickable Maps links", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { FlyerContent } = loadSource("src/components/flyer-surface.tsx");
  const image = renderToStaticMarkup(
    createElement(FlyerContent, {
      item: element("image", { photoKey: "photo" }),
      photoURL: (key) => `/photos/${key}`,
    }),
  );
  assert.match(image, /object-fit:contain/);
  const location = renderToStaticMarkup(
    createElement(FlyerContent, {
      item: element("text", {
        binding: "location",
        locationStyle: "label",
        text: "Cómo llegar",
        address: "Bogotá",
        link: "https:\/\/maps.app.goo.gl/example",
      }),
      photoURL: () => "",
    }),
  );
  assert.match(location, /href="https:\/\/maps.app.goo.gl\/example"/);
  assert.match(location, /Cómo llegar/);
  assert.match(location, /noopener noreferrer/);
});
