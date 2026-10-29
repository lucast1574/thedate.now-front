import Icon from "@/components/icon";
import {
  guestImportSummary,
  type GuestImportResult,
} from "@/lib/events/guest-import-result";

export default function GuestImportReceipt({
  result,
}: {
  result: GuestImportResult;
}) {
  const changed = result.added > 0 || (result.updated || 0) > 0;
  return (
    <div className="guest-import-receipt">
      <div className="guest-import-result" role="status">
        <span className="guest-import-check">
          <Icon name="check" />
        </span>
        <div>
          <strong>
            {changed
              ? "Tu lista está actualizada"
              : "Tu lista ya estaba al día"}
          </strong>
          <p>{guestImportSummary(result)}</p>
        </div>
      </div>
      <a
        href="#guest-list"
        onClick={(event) => {
          const list = document.getElementById("guest-list");
          if (!list) return;
          event.preventDefault();
          list.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
            block: "start",
          });
          list.focus({ preventScroll: true });
        }}
      >
        Ver invitados abajo <Icon name="down" />
      </a>
      {!!result.review?.length && (
        <div
          className="guest-import-issues"
          role="region"
          aria-label="Cambios por revisar"
        >
          <h4>Acompañantes por revisar</h4>
          <ul>
            {result.review.map((item) => (
              <li key={item.phone}>
                <strong>
                  {item.name} ({item.phone}):
                </strong>{" "}
                {item.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
