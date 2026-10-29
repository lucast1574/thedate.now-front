import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { defaultOpening } = loadSource("src/lib/events/celebration.ts");
const { blankEvent } = loadSource("src/lib/events/draft.ts");

test("public and preview openings receive serializable props for both products", () => {
  let props;
  const Invitation = loadSource("src/features/invitations/invitation.tsx", {
    mocks: {
      "./invitation-opening": {
        default: (value) => {
          props = value;
          return null;
        },
      },
    },
  }).default;
  for (const kind of ["wedding", "general"]) {
    for (const photoURL of [
      undefined,
      (key) => `/private/${encodeURIComponent(key)}`,
    ]) {
      for (const background of [false, true]) {
        props = undefined;
        const event = { ...blankEvent(kind), id: "test", slug: "celebration" };
        event.opening = defaultOpening(kind === "wedding");
        if (background)
          event.opening.backgroundImage = {
            photoKey: "cover.jpg",
            fit: "cover",
            position: "center",
            opacity: 1,
          };
        renderToStaticMarkup(createElement(Invitation, { event, photoURL }));
        assert.ok(props);
        assert.doesNotThrow(() => structuredClone(props));
        assert.equal(
          props.backgroundPhotoURL,
          background
            ? (photoURL?.("cover.jpg") ??
                `/api/public-photos/${kind}/celebration/cover.jpg`)
            : undefined,
        );
        assert.equal(props.wedding, kind === "wedding");
      }
    }
  }
});
