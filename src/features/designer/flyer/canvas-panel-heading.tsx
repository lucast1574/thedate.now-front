export default function CanvasPanelHeading({
  tool,
  hidden,
}: {
  tool: string;
  hidden: boolean;
}) {
  const title =
    {
      elements: "Añadir elementos",
      photos: "Tus imágenes",
      opening: "Sobre de apertura",
      experience: "Detalles de la celebración",
      pages: "Secciones",
      music: "Ponle música",
      layers: "Capas del lienzo",
      templates: "Elige tu diseño",
    }[tool] || "Tu invitación";
  return (
    <header hidden={hidden}>
      <span>TU INVITACIÓN</span>
      <h2>{title}</h2>
    </header>
  );
}
