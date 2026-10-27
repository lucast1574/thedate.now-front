import Icon from "@/components/icon";
import type { Opening } from "@/lib/events/celebration";
export default function OpeningArtwork({
  opening,
  title,
  wedding,
}: {
  opening: Opening;
  title: string;
  wedding: boolean;
}) {
  const icon =
    opening.sealIcon ||
    (opening.style === "arch"
      ? "leaf"
      : opening.style === "ticket"
        ? "ticket"
        : wedding
          ? "flower"
          : "sparkle");
  return (
    <>
      <span className="opening-letter" aria-hidden="true">
        <Icon name={wedding ? "flower" : "sparkle"} />
        <span>{opening.title || title}</span>
      </span>
      <span className="opening-fold" aria-hidden="true" />
      {icon !== "none" && (
        <span className="opening-seal" aria-hidden="true">
          <Icon name={icon} />
        </span>
      )}
    </>
  );
}
