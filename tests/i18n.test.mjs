import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./support/load-source.cjs";

const { resolveLocale } = loadSource("src/lib/i18n/locale.ts");
const { createTranslator } = loadSource("src/lib/i18n/translator.ts");

test("automatic locale negotiation respects preference order, regions, weights and Spanish fallback", () => {
  for (const [preferences, expected] of [
    [null, "es"],
    ["", "es"],
    ["de-DE,fr;q=0.9", "es"],
    ["fr-FR,en-US;q=0.8,es;q=0.7", "en"],
    ["en;q=0.5,pt-BR;q=0.9", "pt"],
    ["en;q=0,es-CO;q=0.8", "es"],
    ["PT-pt", "pt"],
    ["es-PE,en;q=0.9", "es"],
    ["en;q=invalid,pt;q=0.7", "pt"],
    [["fr", "pt_BR", "en"], "pt"],
  ])
    assert.equal(resolveLocale(preferences), expected);
});

test("catalogs have complete translations, preserve parameters and keep brand names", () => {
  const read = (locale) =>
    JSON.parse(readFileSync(`src/lib/i18n/messages/${locale}.json`, "utf8"));
  const es = read("es");
  for (const locale of ["en", "pt"]) {
    const catalog = read(locale);
    assert.deepEqual(Object.keys(catalog).sort(), Object.keys(es).sort());
    for (const [source, target] of Object.entries(catalog)) {
      assert.ok(target.trim(), `${locale}: empty translation of ${source}`);
      assert.deepEqual(
        [...target.matchAll(/\{v\d+\}/g)].map((m) => m[0]).sort(),
        [...source.matchAll(/\{v\d+\}/g)].map((m) => m[0]).sort(),
        source,
      );
      for (const brand of ["The Date", "Save the Date"])
        if (source.includes(brand))
          assert.ok(target.includes(brand), `${locale}: ${source}`);
    }
  }
});

test("authentication renders in each automatic locale without language controls", () => {
  for (const [locale, expected] of [
    ["es", "Contraseña"],
    ["en", "Password"],
    ["pt", "Senha"],
  ]) {
    const { default: AuthPanel } = loadSource(
      "src/features/studio/auth-panel.tsx",
      { mocks: { "next-intl": { useLocale: () => locale } } },
    );
    const html = renderToStaticMarkup(
      React.createElement(AuthPanel, {
        wedding: false,
        googleEnabled: true,
        busy: false,
        error: "",
        onSignIn: async () => {},
        onClearError: () => {},
      }),
    );
    assert.ok(html.includes(expected));
    assert.doesNotMatch(
      html,
      /Español|Português|English|language-selector|locale-selector/,
    );
  }
});

test("translation contexts remain independent and never translate supplied values", async () => {
  const en = createTranslator("en"),
    pt = createTranslator("pt");
  const values = { v0: "Nombre <script> & Cuenta" };
  const results = await Promise.all([
    Promise.resolve(en("Invitación a {v0}", values)),
    Promise.resolve(pt("Invitación a {v0}", values)),
  ]);
  assert.ok(results[0].includes(values.v0));
  assert.ok(results[1].includes(values.v0));
  assert.notEqual(results[0], results[1]);
  assert.equal(en("A customer wrote this"), "A customer wrote this");
  assert.equal(en("toString"), "toString");
});

test("localized callbacks ignore map indices instead of treating them as a translator", () => {
  const { bindTranslator } = loadSource("src/lib/i18n/translator.ts");
  const callback = bindTranslator(
    (label, t) => t(label),
    createTranslator("en"),
    1,
  );
  assert.deepEqual(["Nombre", "Contraseña"].map(callback), [
    "Name",
    "Password",
  ]);
});

test("localized catalogs have stable identities and canonical form values stay in Spanish", () => {
  const { invitationTemplates } = loadSource(
    "src/lib/events/template-catalog.ts",
  );
  const { guestCategoriesFor, guestCategory } = loadSource(
    "src/lib/events/guest-categories.ts",
  );
  const en = createTranslator("en"),
    pt = createTranslator("pt");
  assert.equal(invitationTemplates(en), invitationTemplates(en));
  assert.notEqual(invitationTemplates(en), invitationTemplates(pt));
  assert.equal(invitationTemplates(en)[0].id, invitationTemplates(pt)[0].id);
  assert.equal(guestCategoriesFor("general", en)[0], "Familia");
  assert.equal(guestCategory("Familia", "general", pt), "Familia");
});

test("dates and currencies follow the interface locale without changing USD amounts", () => {
  const { formatEventDate } = loadSource("src/lib/events/date.ts");
  const { money } = loadSource("src/lib/account/types.ts");
  const en = formatEventDate(
    "2027-06-19T18:00:00Z",
    "UTC",
    createTranslator("en"),
  );
  const pt = formatEventDate(
    "2027-06-19T18:00:00Z",
    "UTC",
    createTranslator("pt"),
  );
  assert.match(en, /June/);
  assert.match(pt, /junho/);
  assert.match(money(12345, "en"), /123\.45/);
  assert.match(money(12345, "pt-BR"), /123,45/);
});

test("every explicit UI message is registered in the Spanish source catalog", () => {
  const ts = createRequire(import.meta.url)("typescript");
  const es = JSON.parse(readFileSync("src/lib/i18n/messages/es.json", "utf8"));
  function files(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? files(`${directory}/${entry.name}`)
        : [`${directory}/${entry.name}`],
    );
  }
  const missing = [];
  for (const file of files("src").filter(
    (file) => /\.tsx?$/.test(file) && !file.includes("/i18n/"),
  )) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    function visit(node) {
      if (
        ts.isCallExpression(node) &&
        node.expression.getText() === "i18n" &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0]) &&
        !Object.hasOwn(es, node.arguments[0].text)
      )
        missing.push(`${file}: ${node.arguments[0].text}`);
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  assert.deepEqual(missing, []);
});
