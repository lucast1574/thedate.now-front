import type { CSSProperties, ReactNode } from "react";
import type { PublicEvent } from "@/lib/events/types";
import { invitationPaper } from "@/lib/events/invitation-paper";
import { flyerFonts } from "@/lib/events/flyer";
import { normalizeColor, contrastInk } from "@/lib/ui/color";
export default function RSVPTheme({
  event,
  children,
}: {
  event: PublicEvent;
  children: ReactNode;
}) {
  const paper = invitationPaper({
    ...event,
    sections: event.sections?.slice(0, 1),
  });
  const texts =
    event.sections
      ?.flatMap((s) => s.canvas?.elements || [])
      .filter((e) => e.type === "text") || [];
  const heading =
    texts.find(
      (e) => e.binding === "couple_names" || e.binding === "event_title",
    ) || texts.sort((a, b) => b.fontSize - a.fontSize)[0];
  const accent = normalizeColor(event.accentColor) || paper.ink;
  return (
    <div
      className="rsvp-theme"
      data-product={event.kind}
      style={
        {
          "--rsvp-paper": paper.background,
          "--rsvp-ink": paper.ink,
          "--rsvp-accent": accent,
          "--rsvp-action-ink": contrastInk(accent),
          "--rsvp-heading": flyerFonts[heading?.font || "serif"],
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
