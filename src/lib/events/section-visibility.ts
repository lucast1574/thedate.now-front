import type { DesignSection, PublicEvent } from "./types";
export function visibleInvitationSection(
  section: DesignSection,
  event?: PublicEvent,
) {
  if (section.when === "gifts") return !!event?.wishlistEnabled;
  if (section.when === "restrictions")
    return !!event?.celebration?.restrictionText?.trim();
  return true;
}
