export type InboxMessage = {
  paymentRecorded?: boolean;
  id: string;
  eventId: string;
  guestId: string;
  direction: "in" | "out";
  text: string;
  createdAt: string;
  delivery: "received" | "sending" | "sent" | "uncertain";
  media?: { mime: string; filename: string; available: boolean };
};
export type Conversation = {
  guestId: string;
  last: InboxMessage;
  unread: boolean;
  pending: boolean;
};
export type MessagePage = { messages: InboxMessage[]; hasMore: boolean };
