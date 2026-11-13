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

export const pollPromptInstruction =
  "👇 Por favor, responde en la encuesta de aquí abajo para confirmar tu asistencia.";

export function invitationMessagePreview(message: string, link: string) {
  const clean = cleanInvitationMessage(message);
  const prompt = /encuesta/i.test(clean) ? "" : `\n\n${pollPromptInstruction}`;
  return clean
    ? `Abre tu invitación:\n${link}\n\n${clean}${prompt}`
    : `Abre tu invitación:\n${link}\n\n${pollPromptInstruction}`;
}
