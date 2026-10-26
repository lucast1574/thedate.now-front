"use client";
import { useState } from "react";
import AccountShell from "@/features/account/account-shell";
import TicketComposer from "./ticket-composer";
import SupportBoard from "./support-board";

export default function SupportPage({
  wedding,
  googleEnabled,
}: {
  wedding: boolean;
  googleEnabled: boolean;
}) {
  const [revision, setRevision] = useState(0);
  return (
    <AccountShell
      wedding={wedding}
      googleEnabled={googleEnabled}
      active="support"
    >
      {() => (
        <section className="account-content support-page">
          <p className="office-kicker">
            SOPORTE · {wedding ? "SAVE THE DATE" : "THE DATE"}
          </p>
          <h1>Estamos para ayudarte.</h1>
          <p className="office-lead">
            Si algo no funciona como esperabas, cuéntanos. Tu reporte llegará al
            equipo y podrás seguir su avance aquí.
          </p>
          <TicketComposer onCreated={() => setRevision((value) => value + 1)} />
          <SupportBoard key={revision} revision={revision} />
        </section>
      )}
    </AccountShell>
  );
}
