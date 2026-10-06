import Icon from "@/components/icon";
export default function GeneralHero() {
  return (
    <section className="party-hero party-shell">
      <div className="party-copy">
        <p className="party-eyebrow">
          <span className="party-sparkle">
            <Icon name="sparkle" />
          </span>{" "}
          CUALQUIER EXCUSA ES BUENA
        </p>
        <h1>
          Haz del día
          <br />
          un <em>gran plan.</em>
        </h1>
        <p>
          Invitaciones con personalidad para cumpleaños, fiestas y encuentros.
          Organiza a todos, comparte cada detalle y deja que empiece la emoción.
        </p>
        <div className="party-hero-actions">
          <a className="party-button" href="https://crea.thedate.now">
            Crear mi invitación{" "}
            <span>
              <Icon name="external" />
            </span>
          </a>
          <a className="party-link" href="#como-funciona">
            Así funciona{" "}
            <span>
              <Icon name="down" />
            </span>
          </a>
        </div>
        <div className="party-chips">
          <span>
            <Icon name="star" /> Cumpleaños
          </span>
          <span>
            <Icon name="sparkle" /> Fiestas
          </span>
          <span>
            <Icon name="users" /> Reuniones
          </span>
          <span>
            <Icon name="heart" /> Más momentos
          </span>
        </div>
      </div>
      <div className="party-stage" aria-label="Ejemplo de invitación">
        <span className="party-doodle party-doodle-one">
          <Icon name="sparkle" />
        </span>
        <span className="party-doodle party-doodle-two">
          <Icon name="sparkle" />
        </span>
        <span className="party-doodle party-doodle-three">
          <Icon name="circle" />
        </span>
        <div className="party-paper party-paper-back" />
        <div className="party-paper party-paper-front">
          <div className="party-paper-top">
            <span>THE DATE PRESENTA</span>
            <span>
              <Icon name="star" />
            </span>
          </div>
          <span className="party-paper-kicker">NOS VEMOS PARA CELEBRAR</span>
          <strong>
            ¡Es mi
            <br />
            <i>cumple!</i>
          </strong>
          <div className="party-paper-confetti">
            <span>
              <Icon name="sparkle" />
            </span>
            <span>
              <Icon name="circle" />
            </span>
            <span>
              <Icon name="sparkle" />
            </span>
          </div>
          <div className="party-paper-bottom">
            <span>12 OCT · 7:00 PM</span>
            <span>BOGOTÁ, CO</span>
          </div>
        </div>
        <div className="party-rsvp">
          <span>
            <Icon name="check" />
          </span>
          <div>
            <b>¡Voy de una!</b>
            <small>Respuesta confirmada</small>
          </div>
        </div>
        <div className="party-address">
          cumplelucas.thedate.now{" "}
          <span>
            <Icon name="external" />
          </span>
        </div>
      </div>
    </section>
  );
}
