export function giftStore(raw: string) {
  try {
    const host = new URL(raw).hostname.toLowerCase().replace(/^www\./, "");
    if (host === "falabella.com.pe" || host.endsWith(".falabella.com.pe"))
      return "Saga Falabella";
    if (host === "mercadolibre.com.pe" || host.endsWith(".mercadolibre.com.pe"))
      return "Mercado Libre";
    if (host === "coolbox.pe" || host.endsWith(".coolbox.pe")) return "Coolbox";
    return host;
  } catch {
    return "Ver tienda";
  }
}
