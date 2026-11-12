import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";
const { blankEvent, eventPayload } = loadSource("src/lib/events/draft.ts");
const { default: MaybeChoice } = loadSource(
  "src/features/studio/event-maybe-choice.tsx",
);
const { default: GiftsChoice } = loadSource(
  "src/features/studio/event-gifts-choice.tsx",
);
const { default: ResponseFields } = loadSource(
  "src/features/rsvp/response-fields.tsx",
);
const { FlyerContent } = loadSource("src/components/flyer-surface.tsx");

test("new invitations use two answers; old invitations retain maybe and their custom hold", () => {
  for (const kind of ["general", "wedding"]) {
    const draft = blankEvent(kind);
    assert.equal(draft.maybeEnabled, false);
    const html = renderToStaticMarkup(
      createElement(MaybeChoice, { draft, setDraft() {} }),
    );
    assert.doesNotMatch(html, /Tiempo para confirmar|desde su respuesta/);
    const legacy = {
      ...draft,
      id: "legacy",
      maybeEnabled: undefined,
      maybeHoldHours: 37,
    };
    assert.match(
      renderToStaticMarkup(
        createElement(MaybeChoice, { draft: legacy, setDraft() {} }),
      ),
      /value="37"/,
    );
    for (const enabled of [false, true]) {
      const payload = eventPayload({
        ...draft,
        startAt: "2027-01-01T18:00:00Z",
        maybeEnabled: enabled,
      });
      assert.equal(payload.maybeEnabled, enabled);
    }
  }
});

test("gift choice persists without discarding the rest of the celebration", () => {
  let draft = {
    ...blankEvent("wedding"),
    celebration: { adultsOnly: true, dressCode: "Elegante" },
  };
  const control = GiftsChoice({
    draft,
    setDraft: (update) => {
      draft = update(draft);
    },
  });
  control.props.onChange(false);
  assert.equal(draft.celebration.giftsEnabled, false);
  assert.equal(draft.celebration.adultsOnly, true);
  assert.equal(draft.celebration.dressCode, "Elegante");
});

test("RSVP removes maybe and its reason when disabled", () => {
  const html = renderToStaticMarkup(
    createElement(ResponseFields, {
      response: "maybe",
      reason: "Waiting",
      maybeEnabled: false,
      onResponse() {},
      onReason() {},
    }),
  );
  assert.match(html, /Sí, asistiré/);
  assert.match(html, /No podré asistir/);
  assert.doesNotMatch(html, /value="maybe"|textarea|Tal vez/);
});

test("personal RSVP links work independently of disabled or nonexistent gifts", () => {
  for (const event of [
    { celebration: { giftsEnabled: false }, wishlistEnabled: true },
    { wishlistEnabled: false },
  ]) {
    const props = {
      event,
      photoURL: () => "",
      responseURL: "/para/ana-token/respuesta",
    };
    const gift = renderToStaticMarkup(
      createElement(FlyerContent, {
        ...props,
        item: { type: "text", binding: "gift_link", text: "Regalos" },
      }),
    );
    assert.equal(gift, "");
    const response = renderToStaticMarkup(
      createElement(FlyerContent, {
        ...props,
        item: { type: "text", binding: "rsvp_link" },
      }),
    );
    assert.match(response, /href="\/para\/ana-token\/respuesta"/);
    assert.doesNotMatch(response, /regalos/);
  }
});
