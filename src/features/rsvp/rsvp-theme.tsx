import type { CSSProperties, ReactNode } from "react";
import type { PublicEvent } from "@/lib/events/types";
import { invitationPaper } from "@/lib/events/invitation-paper";
import { flyerFonts } from "@/lib/events/flyer";
import { normalizeColor } from "@/lib/ui/color";
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
  const font = event.sections
    ?.flatMap((s) => s.canvas?.elements || [])
    .find((e) => e.type === "text")?.font;
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
          "--rsvp-heading": flyerFonts[font || "serif"],
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
