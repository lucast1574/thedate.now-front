import Icon from "@/components/icon";
import { WeddingMark } from "@/components/brand";
export default function WeddingHero() {
  return (
    <section className="hero shell">
      <div className="wedding-hero-copy">
        <p className="eyebrow">
          <Icon name="sparkle" /> &nbsp;SAVE THE DATE · BODAS
        </p>
        <h1>
          Una fecha.
          <br />
          <em>Para siempre.</em>
        </h1>
        <p className="hero-copy">
          Invitaciones de boda que cuentan su historia. Confirmaciones por
          WhatsApp, aforo claro y cada detalle en un solo lugar.
        </p>
        <div className="hero-actions">
          <a className="button" href="https://studio.save.thedate.now">
            Crear nuestra invitación &nbsp; <Icon name="external" />
          </a>
          <a className="text-link" href="#como-funciona">
            Descubre cómo funciona <Icon name="arrow" />
          </a>
        </div>
      </div>
      <div
        className="wedding-hero-art"
        aria-label="Ejemplo decorativo de una invitación de boda"
      >
        <div className="wedding-paper wedding-paper-back" />
        <div className="wedding-paper wedding-paper-front">
          <div className="wedding-paper-border">
            <span className="wedding-paper-kicker">
              UNA HISTORIA PARA CELEBRAR
            </span>
            <WeddingMark className="wedding-paper-mark" />
            <span className="wedding-paper-overline">JUNTOS PARA SIEMPRE</span>
            <strong>
              Sofía <i>&</i> Mateo
            </strong>
            <span className="wedding-paper-rule" />
            <span className="wedding-paper-date">21 · JUNIO · 2027</span>
            <span className="wedding-paper-foot">
              EL COMIENZO DE ALGO HERMOSO
            </span>
          </div>
        </div>
        <div className="wedding-hero-note">
          <Icon name="sparkle" /> Un enlace único para cada celebración
        </div>
      </div>
    </section>
  );
}
