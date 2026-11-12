export const invitationLinkToken = "{{link}}";

export function cleanInvitationMessage(value = "") {
  return value
    .replace(/\{\{(?:enlace|link)\}\}/gi, "")
    .replace(/\{(?:enlace|link)\}/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function ensureInvitationLink(value: string) {
  return cleanInvitationMessage(value);
}

export function protectInvitationEdit(_previous: string, next: string) {
  return { value: cleanInvitationMessage(next), caret: null };
}

export function moveInvitationLink(value: string, _position: number) {
  return { value: cleanInvitationMessage(value), caret: null };
}

export function invitationMessagePreview(message: string, link: string) {
  const clean = cleanInvitationMessage(message);
  return clean
    ? `Abre tu invitación:\n${link}\n\n${clean}`
    : `Abre tu invitación:\n${link}`;
}
