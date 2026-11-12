import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

test("the top text toolbar exposes alignment, italics and spacing beside font controls", () => {
  const { default: Formatting } = loadSource(
    "src/features/designer/flyer/canvas-formatting.tsx",
    {
      mocks: {
        "@/components/color-picker": { default: () => null },
        "./typeface-picker": { default: () => null },
      },
    },
  );
  const changes = [];
  const tree = Formatting({
    item: {
      type: "text",
      color: "#000000",
      fontSize: 40,
      align: "left",
      bold: false,
    },
    onChange: (patch) => changes.push(patch),
  });
  const html = renderToStaticMarkup(tree);
  for (const label of [
    "Negrita",
    "Cursiva",
    "Alinear izquierda",
    "Alinear centro",
    "Alinear derecha",
    "Interlineado",
    "Espacio entre letras",
  ])
    assert.ok(html.includes(`aria-label="${label}"`), label);
  const children = tree.props.children[2].props.children;
  const italic = children.find(
    (child) => child?.props?.["aria-label"] === "Cursiva",
  );
  italic.props.onClick();
  assert.equal(changes[0].italic, true);
});

test("sidebar and quick alignment share the same element patch and pressed state", () => {
  const { default: Alignment } = loadSource(
    "src/features/designer/flyer/text-alignment.tsx",
  );
  const changes = [];
  const tree = Alignment({
    item: { align: "center" },
    onChange: (patch) => changes.push(patch),
  });
  const buttons = tree.props.children;
  assert.equal(buttons[1].props["aria-pressed"], true);
  buttons[0].props.onClick();
  assert.equal(changes[0].align, "left");
});
