"use client";
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
      aria-label={admin ? "Tickets de soporte" : "Mis reportes"}
    >
      <div className="support-section-head">
        <div>
          <p className="office-kicker">
            {admin ? "SOPORTE · BANDEJA DE ENTRADA" : "TU SEGUIMIENTO"}
          </p>
          <h2>{admin ? "Los reportes de tu plataforma." : "Mis reportes"}</h2>
          <p className="support-hint">
            {admin
              ? "Revisa los fallos que encuentran tus usuarios y déjales una respuesta."
              : "Consulta aquí las actualizaciones y respuestas del equipo."}
          </p>
        </div>
        <button
          className="support-refresh"
          type="button"
          onClick={reload}
          disabled={loading}
        >
          <Icon name="refresh" />
          Actualizar
        </button>
      </div>
      <div
        className="support-filters"
        role="group"
        aria-label="Filtrar reportes por estado"
      >
        {[{ id: "", label: "Todos" }, ...supportStates].map((item) => (
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
        ))}
      </div>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      {loading ? (
        <p className="support-empty" role="status">
          Cargando reportes…
        </p>
      ) : (
        data && (
          <>
            <p className="support-count">
              {data.total} {data.total === 1 ? "reporte" : "reportes"}
              {state ? ` · ${ticketStateLabel(state)}` : ""}
            </p>
            {data.items.length === 0 ? (
              <div className="support-empty">
                <Icon name="ticket" />
                <h3>
                  {admin
                    ? "Nada pendiente por aquí."
                    : "Todavía no hay reportes aquí."}
                </h3>
                <p>
                  {admin
                    ? "Los reportes que coincidan con este estado aparecerán en esta bandeja."
                    : "Cuando envíes un reporte, podrás seguirlo desde este espacio."}
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
                        "Seguimiento guardado. El usuario ya puede consultar la respuesta.",
                      );
                      reload();
                    }}
                  />
                ) : (
                  <div className="support-detail-placeholder">
                    <Icon name="ticket" />
                    <h3>Todo el detalle, en un lugar.</h3>
                    <p>
                      Selecciona un reporte para leerlo
                      {admin
                        ? ", revisar sus capturas y darle seguimiento"
                        : " y ver su seguimiento"}
                      .
                    </p>
                  </div>
                )}
              </div>
            )}
            {data.pages > 1 && (
              <nav
                className="support-pagination"
                aria-label="Páginas de reportes"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((value) => value - 1);
                    setSelected(null);
                  }}
                >
                  Anterior
                </button>
                <span>
                  Página {page} de {data.pages}
                </span>
                <button
                  type="button"
                  disabled={page >= data.pages}
                  onClick={() => {
                    setPage((value) => value + 1);
                    setSelected(null);
                  }}
                >
                  Siguiente
                </button>
              </nav>
            )}
          </>
        )
      )}
    </section>
  );
}
