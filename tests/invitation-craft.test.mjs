import test from "node:test";
import assert from "node:assert/strict";
import { loadSource } from "./support/load-source.cjs";
const { invitationTemplates } = loadSource(
  "src/lib/events/template-catalog.ts",
);
const { blankEvent } = loadSource("src/lib/events/draft.ts");
const { applyCompleteTemplate } = loadSource(
  "src/features/designer/apply-template-design.ts",
  { globals: { crypto } },
);
const { librarySection, sectionRecipes } = loadSource(
  "src/features/designer/section-library.ts",
  { globals: { crypto } },
);
const { invitationTheme, updateInvitationTheme } = loadSource(
  "src/features/designer/invitation-theme.ts",
);
const { alignSelection, moveSelection, selectionIds, elementStyle } =
  loadSource("src/features/designer/flyer/composition.ts");
function checkGeometry(draft) {
  assert.ok(draft.sections.length <= 20);
  for (const page of draft.sections) {
    const c = page.canvas;
    assert.ok(c.art);
    assert.ok(c.height <= 2000);
    assert.equal(new Set(c.elements.map((e) => e.id)).size, c.elements.length);
    for (const e of c.elements) {
      assert.ok(
        e.x >= 0 &&
          e.y >= 0 &&
          e.x + e.width <= c.width + 0.01 &&
          e.y + e.height <= c.height + 0.01,
        `${draft.templateId}/${page.heading}/${e.id}`,
      );
      assert.ok(e.fontSize >= 8 && e.fontSize <= 160);
    }
  }
}
test("all 48 designs support photo-free and photographic compositions, and every library section inherits the theme", () => {
  for (const t of invitationTemplates.filter((t) => t.mode === "flyer")) {
    const source = {
      ...blankEvent(t.kind),
      title:
        t.kind === "wedding"
          ? "María Alejandra y Juan Sebastián"
          : "Una celebración extraordinaria",
      description:
        "Un momento especial para compartir con quienes más queremos.",
      startAt: "2027-06-12T22:00:00Z",
    };
    for (const photos of [true, false]) {
      const draft = applyCompleteTemplate(source, t, photos);
      checkGeometry(draft);
      if (!photos)
        assert.equal(
          draft.sections
            .flatMap((s) => s.canvas.elements)
            .some((e) => e.photoKey === "template-photo"),
          false,
        );
    }
    const draft = updateInvitationTheme(applyCompleteTemplate(source, t), {
      ink: "#123456",
      background: "#f1f2f3",
      font: "script",
    });
    for (const [id] of sectionRecipes) {
      const s = librarySection(draft, id);
      assert.equal(s.canvas.background, "#f1f2f3");
      for (const e of s.canvas.elements.filter((e) => e.type !== "image")) {
        if (
          e.nameFormat !== "initials" &&
          !(id === "cover" && t.layout === "cinematic")
        )
          assert.equal(e.color, "#123456");
        assert.equal(e.font, "script");
      }
    }
  }
});
test("switching designs preserves edited text, selected photos, custom sections and opening photos", () => {
  for (const kind of ["wedding", "general"]) {
    const list = invitationTemplates.filter(
      (t) => t.kind === kind && t.mode === "flyer",
    );
    const draft = applyCompleteTemplate(
      {
        ...blankEvent(kind),
        title: "Una gran celebración",
        description: "Nuestro texto",
      },
      list[0],
    );
    const story = draft.sections.find(
      (s) =>
        s.heading ===
        (kind === "wedding" ? "Nuestra historia" : "Nos reunimos"),
    );
    story.canvas.elements.find((e) => e.type === "image").photoKey =
      "chosen.jpg";
    story.heading = "Nuestra historia personalizada";
    const edited = story.canvas.elements.find((e) => e.id.endsWith("story"));
    edited.text = "Una historia escrita por nosotros, que no se debe perder.";
    draft.sections.push({
      ...librarySection(draft, "schedule"),
      heading: "Programa personalizado",
    });
    draft.opening.backgroundImage = {
      photoKey: "opening.jpg",
      fit: "cover",
      position: "center",
      opacity: 1,
    };
    const next = applyCompleteTemplate(draft, list.at(-1));
    const all = next.sections.flatMap((s) => s.canvas.elements);
    assert.ok(all.some((e) => e.text === edited.text));
    assert.ok(
      next.sections.some((s) => s.heading === "Nuestra historia personalizada"),
    );
    assert.ok(all.some((e) => e.photoKey === "chosen.jpg"));
    assert.ok(
      next.sections.some((s) => s.heading === "Programa personalizado"),
    );
    assert.equal(next.opening.backgroundImage.photoKey, "opening.jpg");
  }
});
test("global changes keep customized exceptions and persist a font on a blank canvas", () => {
  const base = applyCompleteTemplate(
    { ...blankEvent("wedding"), title: "Ana y Luis" },
    invitationTemplates.find((t) => t.mode === "flyer" && t.kind === "wedding"),
  );
  const item = base.sections[0].canvas.elements.find((e) => e.type === "text");
  item.color = "#ff1234";
  item.font = "mono";
  const next = updateInvitationTheme(base, {
    ink: "#112233",
    font: "sans",
    background: "#eeeeee",
  });
  assert.equal(
    next.sections[0].canvas.elements.find((e) => e.id === item.id).color,
    "#ff1234",
  );
  assert.equal(
    next.sections[0].canvas.elements.find((e) => e.id === item.id).font,
    "mono",
  );
  const blank = {
    ...base,
    sections: [
      {
        id: "blank",
        heading: "Blank",
        canvas: {
          width: 720,
          height: 960,
          background: "#ffffff",
          elements: [],
        },
      },
    ],
  };
  assert.equal(
    invitationTheme(updateInvitationTheme(blank, { font: "script" })).font,
    "script",
  );
});
test("alignment and distribution preserve locked objects, group movement stays inside the page", () => {
  const elements = [
    { id: "a", x: 20, y: 10, width: 40, height: 40, groupId: "g" },
    { id: "b", x: 130, y: 80, width: 60, height: 40, groupId: "g" },
    { id: "c", x: 300, y: 50, width: 30, height: 40 },
    { id: "locked", x: 390, y: 30, width: 50, height: 40, locked: true },
  ];
  const canvas = { width: 500, height: 500, elements };
  assert.deepEqual(Array.from(selectionIds(canvas, ["a"])), ["a", "b"]);
  const moved = moveSelection(canvas, ["a", "b", "locked"], 1000, -1000);
  assert.equal(moved.elements[0].y, 0);
  assert.equal(moved.elements[1].x + moved.elements[1].width, 500);
  assert.equal(moved.elements[3], elements[3]);
  const aligned = alignSelection(canvas, ["a", "b", "locked"], "left");
  assert.equal(aligned.elements[1].x - aligned.elements[0].x, 110);
  assert.equal(aligned.elements[0].x, 0);
  assert.equal(aligned.elements[3], elements[3]);
  const spaced = alignSelection(
    {
      ...canvas,
      elements: canvas.elements.map((e) => ({ ...e, groupId: undefined })),
    },
    ["a", "b", "c"],
    "space-x",
  );
  assert.equal(
    spaced.elements[1].x - (spaced.elements[0].x + 40),
    spaced.elements[2].x - (spaced.elements[1].x + 60),
  );
});

test("copying style never carries content, geometry, grouping or locks", () => {
  const copied = elementStyle({
    id: "source",
    text: "Personal text",
    x: 120,
    y: 230,
    width: 300,
    height: 120,
    groupId: "group",
    locked: true,
    color: "#123456",
    font: "script",
    fontSize: 38,
    bold: true,
    align: "right",
  });
  const target = { id: "target", text: "Keep me", x: 40, y: 60, ...copied };
  assert.equal(target.text, "Keep me");
  assert.equal(target.x, 40);
  assert.equal(target.y, 60);
  assert.equal(target.id, "target");
  assert.equal(target.font, "script");
  assert.equal(target.groupId, undefined);
  assert.equal(target.locked, undefined);
});
test("switching at the section limit keeps every user section", () => {
  const t = invitationTemplates.find(
    (t) => t.kind === "wedding" && t.mode === "flyer",
  );
  const source = { ...blankEvent("wedding"), title: "Ana y Luis" };
  source.sections = Array.from({ length: 20 }, (_, n) => ({
    ...librarySection(source, "schedule"),
    heading: `Mi sección ${n}`,
    id: `custom-${n}`,
  }));
  const next = applyCompleteTemplate(source, t);
  assert.equal(next.sections.length, 20);
  assert.deepEqual(
    Array.from(next.sections, (s) => s.id),
    source.sections.map((s) => s.id),
  );
});
