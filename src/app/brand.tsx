export default function Brand({ wedding = false }: { wedding?: boolean }) {
  if (wedding) return <span className="brand brand-wedding">
    <span className="brand-wedding-title">SAVE THE DATE</span>
    <span className="brand-wedding-subtitle">INVITACIONES DE BODA</span>
  </span>;

  return <span className="brand brand-general">
    <svg className="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path className="party-cone" d="M7 40 17 17l14 14L7 40Z" />
      <path className="party-stripe" d="m12 29 7 7m2-16 7 8" />
      <path className="party-burst" d="M27 10V5m-2.5 2.5h5M38 16l3-3m-2 16 4 2M13 9l-2-4" />
      <circle className="party-dot party-dot-pink" cx="34" cy="8" r="2.5" />
      <circle className="party-dot party-dot-gold" cx="39" cy="23" r="2.5" />
      <circle className="party-dot party-dot-purple" cx="18" cy="9" r="1.8" />
    </svg>
    <span className="brand-wordmark">the date<span className="dot">.</span></span>
  </span>;
}
