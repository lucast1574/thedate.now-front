"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
export function SharingDemo({ wedding }: { wedding: boolean }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="shared-workbench shared-demo">
      <aside className="shared-event-card">
        <span className="shared-paid">Vista de ejemplo</span>
        <h2>{wedding ? "Sofía y Mateo" : "La gran celebración"}</h2>
        <p>
          Así acompañarás a tus clientes, desde la primera idea hasta el último
          detalle.
        </p>
        <Link className="office-button" href="/?new=1">
          {wedding ? "Crear mi primera boda" : "Crear mi primer evento"}
          <Icon name="arrow" />
        </Link>
        <small>
          Esta función se habilita para cada celebración después de pagarla.
        </small>
      </aside>
      <section className="shared-invite-panel">
        <Icon name="users" />
        <h2>
          {wedding ? "Un lugar para los dos" : "Invita a sus protagonistas"}
        </h2>
        <p>
          Prueba el recorrido. Los correos de esta demo no se envían ni se
          guardan.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="shared-email-grid">
            {[1, 2].map((n) => (
              <label key={n}>
                Correo de la persona {n}
                <input
                  type="email"
                  placeholder={n === 1 ? "sofia@gmail.com" : "mateo@gmail.com"}
                />
              </label>
            ))}
          </div>
          <button className="office-button">
            Probar invitación <Icon name="arrow" />
          </button>
        </form>
        {sent && (
          <p role="status" className="shared-success">
            <Icon name="check" />
            Así de fácil. En una celebración pagada recibirán un correo para
            entrar con su propia cuenta.
          </p>
        )}
        <div className="shared-access-notes">
          <Icon name="lock" />
          <p>
            Entran con Google o con su cuenta. Solo ven la celebración asignada,
            con acceso al diseño, invitados, mesas y regalos.
          </p>
        </div>
      </section>
    </div>
  );
}
