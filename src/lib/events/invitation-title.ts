const connectors = new Set(["y", "e", "de", "del", "la", "las", "los"]);

export function invitationTitle(
  kind: string,
  title: string,
  names?: { partnerOne?: string; partnerTwo?: string } | null,
) {
  if (
    kind === "wedding" &&
    names?.partnerOne?.trim() &&
    names?.partnerTwo?.trim()
  ) {
    const key = (value: string) =>
      value
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLocaleLowerCase("es")
        .replace(/[^\p{L}\p{N}]/gu, "");
    if (key(title) === key(`${names.partnerOne} y ${names.partnerTwo}`))
      return `${capitalizedNames(names.partnerOne)} y ${capitalizedNames(names.partnerTwo)}`;
  }
  if (kind !== "wedding" || !/(\p{Ll})y(\p{Lu})|\s+[yY]\s+/u.test(title))
    return title.trim();
  return capitalizedNames(title.replace(/(\p{Ll})y(\p{Lu})/gu, "$1 y $2"));
}

export function capitalizedNames(title: string) {
  let first = true;
  return title
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\p{L}[\p{L}\p{M}]*/gu, (word) => {
      const lower = word.toLocaleLowerCase("es");
      if (!first && connectors.has(lower)) return lower;
      first = false;
      return lower[0].toLocaleUpperCase("es") + lower.slice(1);
    });
}
