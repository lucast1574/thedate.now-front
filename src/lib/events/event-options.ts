import type { PublicEvent } from "./types";

export function giftListEnabled(event?: Partial<PublicEvent>) {
  return (
    event?.celebration?.giftsEnabled !== false &&
    event?.wishlistEnabled !== false
  );
}
