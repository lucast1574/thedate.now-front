"use client";
import ProductHeading from "@/components/product-heading";
import Link from "next/link";
import { useState } from "react";
import Alert from "@/components/alert";
import GuestForm from "@/features/studio/guest-form";
import GuestImport from "@/features/studio/guest-import";
import DoorPanel from "./door-panel";
import { useManager } from "./use-manager";
import GuestSummary from "./guest-summary";
import GuestRoster from "./guest-roster";
import SeatingEditor from "./seating-editor";
export default function ManagerPage({ id }: { id: string }) {
  const manager = useManager(id);
  const [tab, setTab] = useState("guests");
  const { event, guests, plan, user, busy, error, dirty, stale } = manager;
  if (!event)
    return (
      <main className="editor-loading">
        <h1>Gestor de invitados</h1>
        <p role={error ? "alert" : "status"}>
          {error || "Abriendo tu evento…"}
        </p>
        <Link href="/">Volver al estudio e iniciar sesión</Link>
      </main>
    );
  const allowed = event.paymentStatus === "paid" && !event.isDemo;
  const canSend = user?.role === "admin" || user?.id === event.ownerId;
  return (
    <main
      className={`manager-page ${event.kind === "wedding" ? "manager-wedding" : "manager-general"}`}
    >
      <header className="manager-header">
        <div>
          <ProductHeading kind={event.kind} area="manager" />
          <h1>{event.title}</h1>
          <p>De la confirmación al asiento: cada persona cuenta.</p>
        </div>
        <div className="action-row">
          <Link
            href="/"
            onClick={(e) => {
              if (
                dirty &&
                !window.confirm(
                  "Hay cambios del plano sin guardar. ¿Salir y descartarlos?",
                )
              )
                e.preventDefault();
            }}
          >
            Estudio
          </Link>
          <Link
            href={`/editor/${id}`}
            onClick={(e) => {
              if (
                dirty &&
                !window.confirm(
                  "Hay cambios del plano sin guardar. ¿Salir y descartarlos?",
                )
              )
                e.preventDefault();
            }}
          >
            Editar invitación ↗
          </Link>
        </div>
      </header>
      <Alert>{error}</Alert>
      <Alert variant="success">{manager.notice}</Alert>
      {!allowed ? (
        <section className="guest-locked">
          <h2>Activa el gestor de tu evento</h2>
          <p>
            Guardar y previsualizar tu invitación es gratis. El pago habilita
            publicación, invitados, WhatsApp y mesas.
          </p>
          <Link href="/">Volver al estudio para activar</Link>
        </section>
      ) : (
        <>
          <GuestSummary event={event} guests={guests} />
          <nav className="manager-tabs" aria-label="Herramientas de invitados">
            {[
              ["guests", "Invitados y respuestas"],
              ["tables", "Plano de mesas"],
              ["door", "Excel para entrada"],
            ].map(([key, label]) => (
              <button
                key={key}
                aria-current={tab === key ? "page" : undefined}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
            <button
              disabled={busy}
              onClick={() => {
                void manager.run(
                  () => manager.refresh(),
                  "Respuestas actualizadas.",
                );
              }}
            >
              Actualizar respuestas ↻
            </button>
          </nav>
          {stale && (
            <p className="manager-warning" role="alert">
              Hay respuestas o cambios nuevos. Conservamos tu borrador; recarga
              el plano antes de guardarlo o exportar.
            </p>
          )}
          {tab === "guests" && (
            <>
              <div className="manager-additions">
                <GuestForm busy={busy} onAdd={manager.add} />
                <GuestImport
                  eventId={id}
                  onImported={() => manager.refresh()}
                />
              </div>
              {canSend && (
                <div className="manager-send">
                  <button
                    className="office-button"
                    disabled={
                      busy ||
                      !event.publishedAt ||
                      !guests.some((g) => !g.sentAt)
                    }
                    onClick={() => {
                      void manager.send();
                    }}
                  >
                    Enviar invitaciones por WhatsApp ↗
                  </button>
                  <p>
                    {event.publishedAt
                      ? "El enlace personal permite registrar acompañantes y confirmar asistencia."
                      : "Publica la invitación desde el estudio para habilitar el envío."}
                  </p>
                </div>
              )}
              <GuestRoster guests={guests} plan={plan} />
            </>
          )}
          {tab === "tables" && (
            <SeatingEditor
              event={event}
              guests={guests}
              plan={plan}
              dirty={dirty}
              stale={stale}
              busy={busy}
              onChange={manager.update}
              onSave={() => {
                void manager.save();
              }}
              onReload={() => {
                void manager.run(
                  () => manager.refresh(true),
                  "Plano recargado.",
                );
              }}
            />
          )}
          {tab === "door" && (
            <DoorPanel
              event={event}
              guests={guests}
              plan={plan}
              blocked={busy || dirty || stale}
              dirty={dirty}
              onExport={(task) => {
                void manager.run(task, "Excel generado.");
              }}
            />
          )}
        </>
      )}
    </main>
  );
}
