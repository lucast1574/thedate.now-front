"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import SeatingCanvas from "./seating-canvas";
import { emptyPlan, type SeatingPlan } from "@/lib/events/seating";
const examples = [
  {
    name: "Valentina Torres",
    people: 2,
    status: "Confirmado",
    gift: "Cafetera",
  },
  { name: "Mateo Rojas", people: 1, status: "Pendiente", gift: "Sin elección" },
  {
    name: "Lucía y familia",
    people: 4,
    status: "Confirmado",
    gift: "Juego de copas",
  },
];
export default function OrganizationPreview({
  tool = "guests",
  eventId,
  active = false,
}: {
  tool?: string;
  eventId?: string;
  active?: boolean;
}) {
  const [selected, setSelected] = useState("");
  const [plan, setPlan] = useState<SeatingPlan>({
    ...emptyPlan(),
    tables: [
      {
        id: "a",
        name: "Familia",
        shape: "round",
        capacity: 8,
        x: 240,
        y: 280,
        rotation: 0,
      },
      {
        id: "b",
        name: "Amigos",
        shape: "round",
        capacity: 6,
        x: 730,
        y: 240,
        rotation: 0,
      },
      {
        id: "c",
        name: "Mesa principal",
        shape: "rectangle",
        capacity: 8,
        x: 530,
        y: 650,
        rotation: 0,
      },
    ],
  });
  return (
    <section className="organization-preview">
      <header>
        <span className="preview-label">Vista previa · datos de ejemplo</span>
        <h2>
          {tool === "tables"
            ? "Un lugar para cada persona"
            : tool === "gifts"
              ? "Cada regalo, una persona"
              : "Todo empieza con tus invitados"}
        </h2>
        <p>
          {tool === "tables"
            ? "Mueve las mesas del ejemplo y descubre cómo organizarás el espacio de tu evento."
            : tool === "gifts"
              ? "Comparte ideas de tus tiendas favoritas y conoce quién se compromete con cada regalo."
              : "Nombres, acompañantes, confirmaciones y regalos en un solo lugar para cada evento."}
        </p>
      </header>
      {tool === "tables" ? (
        <div className="preview-seating">
          <SeatingCanvas
            plan={plan}
            people={[]}
            selected={selected}
            onSelect={setSelected}
            onMove={(id, x, y) =>
              setPlan((current) => ({
                ...current,
                tables: current.tables.map((table) =>
                  table.id === id ? { ...table, x, y } : table,
                ),
              }))
            }
          />
        </div>
      ) : (
        <div className="preview-roster">
          <div className="preview-roster-head">
            <span>Invitación</span>
            <span>Personas</span>
            <span>Estado</span>
            <span>Regalo</span>
          </div>
          {examples.map((row) => (
            <div key={row.name}>
              <strong>{row.name}</strong>
              <span>{row.people}</span>
              <span
                className={`preview-response ${row.status === "Confirmado" ? "is-confirmed" : ""}`}
              >
                {row.status}
              </span>
              <span>{row.gift}</span>
            </div>
          ))}
        </div>
      )}
      <div className="organization-benefits">
        {[
          ["users", "Invitados y acompañantes"],
          ["table", "Mesas y aforo"],
          ["lucide:gift", "Regalos sin repetir"],
          ["check", "Control de entrada en Excel"],
        ].map(([icon, label]) => (
          <span key={label}>
            <Icon name={icon} />
            {label}
          </span>
        ))}
      </div>
      <footer>
        <p>
          {active
            ? "Este evento ya tiene su espacio activo. Abre sus invitados, mesas y regalos."
            : "Al activar un evento, se abre su espacio de organización con sus propios invitados, mesas y regalos."}
        </p>
        <Link
          className="gift-primary"
          href={
            eventId
              ? active
                ? `/manager/${eventId}?tab=${tool}`
                : `/?event=${eventId}`
              : "/?new=1"
          }
        >
          {eventId
            ? active
              ? "Organizar este evento"
              : "Activar este evento"
            : "Crear mi evento"}
          <Icon name="arrow" />
        </Link>
      </footer>
    </section>
  );
}
