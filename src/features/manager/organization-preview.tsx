"use client";
import { useTranslator } from "@/lib/i18n/react";
import {
  type Translator,
  localized,
  bindTranslator,
} from "@/lib/i18n/translator";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import SeatingCanvas from "./seating-canvas";
import { exampleSeatingPlan } from "@/lib/events/venue-examples";
import GiftExperiencePreview from "@/features/gifts/gift-experience-preview";
import { exampleVenueAreas } from "@/lib/events/venue-areas";
const examples = localized((i18n: Translator) => [
  {
    name: i18n("Valentina Torres"),
    people: 2,
    status: i18n("Confirmado"),
    gift: i18n("Cafetera"),
  },
  {
    name: i18n("Mateo Rojas"),
    people: 1,
    status: i18n("Pendiente"),
    gift: i18n("Sin elección"),
  },
  {
    name: i18n("Lucía y familia"),
    people: 4,
    status: i18n("Confirmado"),
    gift: i18n("Juego de copas"),
  },
]);
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
  const i18n = useTranslator();

  const [selected, setSelected] = useState("");
  const [areas, setAreas] = useState(
    bindTranslator(exampleVenueAreas, i18n, 0),
  );
  const [plan, setPlan] = useState(() => exampleSeatingPlan(wedding, i18n));
  return (
    <section className="organization-preview">
      <header>
        <span className="preview-label">
          {i18n("Vista previa · datos de ejemplo")}
        </span>
        <h2>
          {tool === "tables"
            ? i18n("Un lugar para cada persona")
            : tool === "gifts"
              ? i18n("Cada regalo, una persona")
              : i18n("Todo empieza con tus invitados")}
        </h2>
        <p>
          {tool === "tables"
            ? i18n(
                "Mueve mesas, bocaditos, bar y pista de baile para distribuir el espacio de tu evento.",
              )
            : tool === "gifts"
              ? i18n(
                  "Tu invitación conecta con tu lista automáticamente. Añade regalos, evita repetidos y conoce quién elige cada detalle.",
                )
              : i18n(
                  "Nombres, acompañantes, confirmaciones y regalos en un solo lugar para cada evento.",
                )}
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
            <span>{i18n("Invitación")}</span>
            <span>{i18n("Personas")}</span>
            <span>{i18n("Estado")}</span>
            <span>{i18n("Regalo")}</span>
          </div>
          {examples(i18n).map((row) => (
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
          ["users", i18n("Invitados y acompañantes")],
          ["table", i18n("Mesas y aforo")],
          ["lucide:gift", i18n("Regalos sin repetir")],
          ["check", i18n("Control de entrada en Excel")],
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
            ? i18n(
                "Este evento ya tiene su espacio activo. Abre sus invitados, mesas y regalos.",
              )
            : i18n(
                "Al activar un evento, se abre su espacio de organización con sus propios invitados, mesas y regalos.",
              )}
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
              ? i18n("Organizar este evento")
              : i18n("Activar este evento")
            : i18n("Crear mi evento")}
          <Icon name="arrow" />
        </Link>
      </footer>
    </section>
  );
}
