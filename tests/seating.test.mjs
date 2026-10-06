import assert from "node:assert/strict";
import test from "node:test";
import { loadSource } from "./support/load-source.cjs";
const { parseGuestCSV } = loadSource("src/lib/events/guest-csv.ts");
const { guestStats, attendees } = loadSource("src/lib/events/attendees.ts");
const { proposeSeating, newTable } = loadSource(
  "src/lib/events/auto-seating.ts",
);
const { doorRows } = loadSource("src/lib/events/door-export.ts");
const { emptyPlan } = loadSource("src/lib/events/seating.ts");
const { validateWorkbookZip } = loadSource("src/lib/events/xlsx-guard.ts", {
  globals: { TextDecoder },
});
const guest = (id, fields = {}) => ({
  id,
  name: "Ana",
  lastName: "Rojas",
  phone: "+51987654321",
  response: "going",
  seats: 2,
  companions: [{ name: "Luis", lastName: "Rojas", gender: "man" }],
  ...fields,
});
test("CSV includes surname, family and named companions with allowance validation", () => {
  const rows = parseGuestCSV(
    'nombre,apellido,telefono,cupos,genero,familia,acompanantes,apellidos_acompanantes,generos_acompanantes\nAna,Rojas,+51987654321,3,mujer,"Rojas, familia",Luis|Pablo,Rojas|Paz,hombre|sin especificar',
  );
  assert.equal(rows[0].family, "Rojas, familia");
  assert.equal(rows[0].companions.length, 2);
  assert.equal(rows[0].companions[1].gender, "unspecified");
  assert.throws(
    () =>
      parseGuestCSV(
        "nombre,telefono,cupos,acompanantes\nAna,+51987654321,1,Luis",
      ),
    /fila 2/,
  );
  assert.throws(
    () => parseGuestCSV("nombre,telefono,cupos\nAna,987654321,2"),
    /fila 2/,
  );
});
test("actual party count, temporary holds and unknown companion slots are separate", () => {
  const now = Date.now();
  const guests = [
    guest("a", { attendingSeats: 1, companions: [] }),
    guest("b", {
      response: "maybe",
      maybeExpiresAt: new Date(now + 60000).toISOString(),
    }),
    guest("c", {
      response: "maybe",
      maybeExpiresAt: new Date(now - 1).toISOString(),
    }),
    guest("d", { response: "not_going" }),
  ];
  const stats = guestStats(guests, now);
  assert.equal(stats.confirmed, 1);
  assert.equal(stats.held, 2);
  assert.equal(stats.invited, 8);
  const unnamed = attendees([guest("e", { companions: [] })]);
  assert.equal(unnamed[1].registered, false);
  assert.equal(unnamed[1].id, "e~1");
});
test("auto seating keeps households, counts +1, groups families and observes aforo", () => {
  const guests = [
    guest("a"),
    guest("b", { name: "Maria" }),
    guest("c", { lastName: "Paz", response: "pending" }),
    guest("d", { response: "not_going" }),
  ];
  const plan = emptyPlan();
  plan.tables = [
    newTable(0, 4, "round", "one"),
    newTable(1, 4, "rectangle", "two"),
  ];
  const result = proposeSeating(guests, plan, { capacity: 4 }, 4, false);
  assert.equal(Object.keys(result.plan.assignments).length, 4);
  assert.equal(result.plan.assignments["a~0"], result.plan.assignments["b~1"]);
  assert.equal(result.plan.assignments["c~0"], undefined);
  assert.equal(Object.keys(plan.assignments).length, 0);
  const limited = proposeSeating(guests, plan, { capacity: 3 }, 4, false);
  assert.equal(Object.keys(limited.plan.assignments).length, 2);
  assert.equal(limited.unassigned.length, 2);
  const tooSmall = { ...plan, tables: [newTable(0, 1, "round", "tiny")] };
  assert.equal(
    proposeSeating(
      [guest("a")],
      tooSmall,
      { capacityUnlimited: true },
      4,
      false,
    ).unassigned.length,
    2,
  );
});
test("door export has one row per confirmed person, table names and no secret links", () => {
  const guests = [
    guest("a", { invitationUrl: "secret-url" }),
    guest("b", { response: "not_going" }),
    guest("c", { response: "pending" }),
  ];
  const plan = emptyPlan();
  plan.tables = [newTable(0, 4, "round", "t")];
  plan.assignments = { "a~0": "t", "a~1": "t" };
  const rows = doorRows(guests, plan, true);
  assert.equal(rows.length, 2);
  assert.equal(rows[0][6], "Mesa 1");
  assert.equal(rows[1][3], "Acompañante");
  assert.equal(JSON.stringify(rows).includes("secret-url"), false);
  assert.equal(JSON.stringify(rows).includes("+519"), false);
  assert.equal(doorRows(guests, plan, false).length, 4);
});
test("Excel guard rejects junk and oversized ZIP metadata before decompression", () => {
  assert.throws(() => validateWorkbookZip(new ArrayBuffer(5)), /Excel/);
  const bytes = new ArrayBuffer(68),
    v = new DataView(bytes);
  v.setUint32(0, 0x02014b50, true);
  v.setUint32(24, 21000000, true);
  v.setUint32(46, 0x06054b50, true);
  v.setUint16(56, 1, true);
  v.setUint32(62, 0, true);
  assert.throws(() => validateWorkbookZip(bytes), /20 MB/);
});
