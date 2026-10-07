import Icon from "@/components/icon";
export default function ProductAlternative({
  wedding,
  footer = false,
}: {
  wedding: boolean;
  footer?: boolean;
}) {
  return (
    <div
      className={`workspace-alternative ${footer ? "workspace-mobile-alternative" : ""}`}
    >
      <span>
        {wedding ? "¿Otra ocasión para celebrar?" : "¿Preparando una boda?"}
      </span>
      <a
        href={
          wedding
            ? "https://crea.thedate.now"
            : "https://studio.save.thedate.now"
        }
      >
        {wedding ? "Descubre The Date" : "Descubre Save the Date"}
        <Icon name="external" />
      </a>
    </div>
  );
}
