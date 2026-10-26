import Brand from "@/components/brand";
import type { PublicEvent } from "@/lib/events/types";
import { invitationPaper } from "@/lib/events/invitation-paper";
export default function InvitationBrand({ event }: { event: PublicEvent }) {
  const wedding = event.kind === "wedding";
  const paper = invitationPaper(event);
  return (
    <footer
      className="invite-footer"
      data-product={event.kind}
      style={{ backgroundColor: paper.footer, color: paper.ink }}
    >
      <a
        href={wedding ? "https://save.thedate.now" : "https://thedate.now"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          wedding
            ? "Save the Date · save.thedate.now"
            : "The Date · thedate.now"
        }
      >
        <Brand wedding={wedding} />
      </a>
    </footer>
  );
}
