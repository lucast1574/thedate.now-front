const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
export function personalPath(token: string, name = "") {
  if (!/^[a-f0-9]{48}$/.test(token)) return `/rsvp/${token}`;
  let code = "";
  for (let i = 0; i < token.length; i += 6) {
    const value = parseInt(token.slice(i, i + 6), 16);
    for (const shift of [18, 12, 6, 0])
      code += alphabet[(value >>> shift) & 63];
  }
  const slug =
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60)
      .replace(/-$/, "") || "invitado";
  return `/para/${slug}-${code}`;
}
export function personalToken(handle: string) {
  if (!/^[a-z0-9-]{1,60}-[A-Za-z0-9_-]{32}$/.test(handle)) return "";
  const code = handle.slice(-32);
  let token = "";
  for (let i = 0; i < code.length; i += 4) {
    const value = [0, 1, 2, 3].reduce(
      (n, offset) => (n << 6) | alphabet.indexOf(code[i + offset]),
      0,
    );
    token += value.toString(16).padStart(6, "0");
  }
  return token;
}
export function tokenFromPath(path: string) {
  const legacy = /^\/(?:rsvp|regalos)\/([a-f0-9]{48})(?:\/respuesta)?\/?$/.exec(
    path,
  );
  if (legacy) return legacy[1];
  const personal = /^\/para\/([^/]+)(?:\/(?:respuesta|regalos))?\/?$/.exec(
    path,
  );
  return personal ? personalToken(personal[1]) : "";
}
