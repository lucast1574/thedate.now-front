export function safeContinuation(value: string | null | undefined) {
  return value &&
    /^\/(?:join\/[a-f0-9]{48}|admin|affiliates|profile)$/.test(value)
    ? value
    : "/";
}
export function safeReferral(value: string | null | undefined) {
  return value && /^[a-f0-9]{24}$/.test(value) ? value : "";
}
