export const invitationLinkToken = "{{link}}";
export function ensureInvitationLink(value: string) {
  let found = false;
  const message = value.replace(/\{\{(?:enlace|link)\}\}/g, () => {
    if (found) return "";
    found = true;
    return invitationLinkToken;
  });
  const normalized = found
    ? message
    : `${message.trimEnd()}${message.trim() ? "\n\n" : ""}${invitationLinkToken}`;
  const index = normalized.indexOf(invitationLinkToken);
  const before = normalized
    .slice(0, index)
    .slice(0, 4000 - invitationLinkToken.length);
  const after = normalized
    .slice(index + invitationLinkToken.length)
    .slice(0, 4000 - invitationLinkToken.length - before.length);
  return before + invitationLinkToken + after;
}
export function protectInvitationEdit(previous: string, next: string) {
  const token = invitationLinkToken;
  const matches = next.match(/\{\{link\}\}/g) || [];
  if (matches.length === 1) return { value: next, caret: null };
  const index = previous.indexOf(token);
  let start = 0,
    suffix = 0;
  while (
    start < previous.length &&
    start < next.length &&
    previous[start] === next[start]
  )
    start++;
  while (
    suffix < previous.length - start &&
    suffix < next.length - start &&
    previous[previous.length - 1 - suffix] === next[next.length - 1 - suffix]
  )
    suffix++;
  const end = previous.length - suffix;
  const inserted = next
    .slice(start, next.length - suffix)
    .replace(/\{\{(?:enlace|link)\}\}/g, "");
  if (start < index + token.length && end > index) {
    const before = previous.slice(0, Math.min(start, index));
    const after = previous.slice(Math.max(end, index + token.length));
    return {
      value: before + inserted + token + after,
      caret: before.length + inserted.length,
    };
  }
  return {
    value: previous.slice(0, start) + inserted + previous.slice(end),
    caret: start + inserted.length,
  };
}
export function moveInvitationLink(value: string, position: number) {
  const index = value.indexOf(invitationLinkToken);
  const text =
    value.slice(0, index) + value.slice(index + invitationLinkToken.length);
  const target = Math.max(
    0,
    Math.min(
      text.length,
      position <= index
        ? position
        : position < index + invitationLinkToken.length
          ? index
          : position - invitationLinkToken.length,
    ),
  );
  return {
    value: text.slice(0, target) + invitationLinkToken + text.slice(target),
    caret: target + invitationLinkToken.length,
  };
}

export function invitationMessagePreview(message: string, link: string) {
  return message.replace(invitationLinkToken, (_token, index: number) => {
    const before = message.slice(0, index),
      after = message.slice(index + invitationLinkToken.length);
    return (
      (/[^\s]$/u.test(before) ? " " : "") +
      link +
      (/^[\p{L}\p{N}]/u.test(after) ? " " : "")
    );
  });
}
