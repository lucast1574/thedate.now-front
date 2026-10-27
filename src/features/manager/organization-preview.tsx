"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import SeatingCanvas from "./seating-canvas";
import { exampleSeatingPlan } from "@/lib/events/venue-examples";
import GiftExperiencePreview from "@/features/gifts/gift-experience-preview";
import { exampleVenueAreas } from "@/lib/events/venue-areas";
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
  wedding = false,
}: {
  tool?: string;
  eventId?: string;
  active?: boolean;
  wedding?: boolean;
}) {
  const [selected, setSelected] = useState("");
  const [areas, setAreas] = useState(exampleVenueAreas);
  const [plan, setPlan] = useState(exampleSeatingPlan);
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
            ? "Mueve mesas, bocaditos, bar y pista de baile para distribuir el espacio de tu evento."
            : tool === "gifts"
              ? "Comparte ideas de tus tiendas favoritas y conoce quién se compromete con cada regalo."
              : "Nombres, acompañantes, confirmaciones y regalos en un solo lugar para cada evento."}
        </p>
      </header>
      {tool === "gifts" ? (
        <GiftExperiencePreview wedding={wedding} />
      ) : tool === "tables" ? (
        <div className="preview-seating">
          <SeatingCanvas
            plan={plan}
            people={[]}
            selected={selected}
            onSelect={setSelected}
            areas={areas}
            onMoveArea={(id, x, y) =>
              setAreas((current) =>
                current.map((area) =>
                  area.id === id ? { ...area, x, y } : area,
                ),
              )
            }
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
