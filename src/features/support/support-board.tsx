"use client";
import SupportPagination from "./support-pagination";
import { useTranslator } from "@/lib/i18n/react";

import TicketList from "./ticket-list";
import { useState } from "react";
import Alert from "@/components/alert";
import Icon from "@/components/icon";
import {
  supportStates,
  ticketStateLabel,
  type Ticket,
} from "@/lib/support/types";
import { useTickets } from "./use-tickets";
import TicketDetail from "./ticket-detail";
import AdminKanban from "./admin-kanban";

export default function SupportBoard(props: {
  admin?: boolean;
  revision?: number;
}) {
  return props.admin ? (
    <AdminKanban revision={props.revision} />
  ) : (
    <SupportListBoard {...props} />
  );
}

function SupportListBoard({
  admin = false,
  revision = 0,
}: {
  admin?: boolean;
  revision?: number;
}) {
  const i18n = useTranslator();

  const [state, setState] = useState(admin ? "OPEN" : ""),
    [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0),
    [selected, setSelected] = useState<Ticket | null>(null);
  const [notice, setNotice] = useState("");
  const { data, loading, error } = useTickets(
    admin,
    state,
    page,
    revision + refresh,
  );
  function reload() {
    setSelected(null);
    setRefresh((value) => value + 1);
  }
  return (
    <section
      className="account-card support-inbox"
      id={admin ? "support" : undefined}
      aria-label={admin ? i18n("Tickets de soporte") : i18n("Mis reportes")}
    >
      <div className="support-section-head">
        <div>
          <p className="office-kicker">
            {admin
              ? i18n("SOPORTE · BANDEJA DE ENTRADA")
              : i18n("TU SEGUIMIENTO")}
          </p>
          <h2>
            {admin
              ? i18n("Los reportes de tu plataforma.")
              : i18n("Mis reportes")}
          </h2>
          <p className="support-hint">
            {admin
              ? i18n(
                  "Revisa los fallos que encuentran tus usuarios y déjales una respuesta.",
                )
              : i18n(
                  "Consulta aquí las actualizaciones y respuestas del equipo.",
                )}
          </p>
        </div>
        <button
          className="support-refresh"
          type="button"
          onClick={reload}
          disabled={loading}
        >
          <Icon name="refresh" />
          {i18n("Actualizar")}
        </button>
      </div>
      <div
        className="support-filters"
        role="group"
        aria-label={i18n("Filtrar reportes por estado")}
      >
        {[{ id: "", label: i18n("Todos") }, ...supportStates(i18n)].map(
          (item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={state === item.id}
              onClick={() => {
                setState(item.id);
                setPage(1);
                setSelected(null);
                setNotice("");
              }}
            >
              {item.label}
            </button>
          ),
        )}
      </div>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      {loading ? (
        <p className="support-empty" role="status">
          {i18n("Cargando reportes…")}
        </p>
      ) : (
        data && (
          <>
            <p className="support-count">
              {data.total}{" "}
              {data.total === 1 ? i18n("reporte") : i18n("reportes")}
              {state ? ` · ${ticketStateLabel(state, i18n)}` : ""}
            </p>
            {data.items.length === 0 ? (
              <div className="support-empty">
                <Icon name="ticket" />
                <h3>
                  {admin
                    ? i18n("Nada pendiente por aquí.")
                    : i18n("Todavía no hay reportes aquí.")}
                </h3>
                <p>
                  {admin
                    ? i18n(
                        "Los reportes que coincidan con este estado aparecerán en esta bandeja.",
                      )
                    : i18n(
                        "Cuando envíes un reporte, podrás seguirlo desde este espacio.",
                      )}
                </p>
              </div>
            ) : (
              <div className="support-layout">
                <TicketList
                  tickets={data.items}
                  selectedID={selected?.id}
                  onSelect={setSelected}
                />
                {selected ? (
                  <TicketDetail
                    key={`${selected.id}-${selected.version}`}
                    ticket={selected}
                    admin={admin}
                    onUpdated={() => {
                      setNotice(
                        i18n(
                          "Seguimiento guardado. El usuario ya puede consultar la respuesta.",
                        ),
                      );
                      reload();
                    }}
                  />
                ) : (
                  <div className="support-detail-placeholder">
                    <Icon name="ticket" />
                    <h3>{i18n("Todo el detalle, en un lugar.")}</h3>
                    <p>
                      {i18n("Selecciona un reporte para leerlo")}{" "}
                      {admin
                        ? i18n(", revisar sus capturas y darle seguimiento")
                        : i18n(" y ver su seguimiento")}
                      .
                    </p>
                  </div>
                )}
              </div>
            )}
            {data.pages > 1 && (
              <SupportPagination
                page={page}
                pages={data.pages}
                setPage={setPage}
                setSelected={setSelected}
              />
            )}
          </>
        )
      )}
    </section>
  );
}
