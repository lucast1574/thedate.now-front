export const inboxUpdated = "thedate:inbox-updated";

export function refreshInboxStatus() {
  window.dispatchEvent(new Event(inboxUpdated));
}
