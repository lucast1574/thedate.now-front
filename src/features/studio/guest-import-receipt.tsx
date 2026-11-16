import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  return (
    <div className="guest-import-receipt" role="status">
      <p>{guestImportSummary(result, i18n)}</p>
      <a
        className="guest-complete-hint"
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
        {i18n("Ver tus invitados en la lista de abajo")} <Icon name="down" />
      </a>
    </div>
  );
}

export function GuestImportReview({ result }: { result: GuestImportResult }) {
  const i18n = useTranslator();

  return (
    !!result.review?.length && (
      <div
        className="guest-import-issues"
        role="region"
        aria-label={i18n("Cambios por revisar")}
      >
        <h4>{i18n("Acompañantes por revisar")}</h4>
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
    )
  );
}
