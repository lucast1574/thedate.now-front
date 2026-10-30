const stores: [string, string[]][] = [
  ["Saga Falabella", ["falabella.com.pe"]],
  ["Falabella", ["falabella.com", "falabella.com.co", "falabella.cl"]],
  [
    "Mercado Libre",
    [
      "mercadolibre.com.pe",
      "mercadolibre.com.ar",
      "mercadolibre.com.mx",
      "mercadolibre.com.co",
      "mercadolibre.cl",
      "mercadolibre.com.uy",
      "mercadolibre.com.ec",
      "mercadolibre.com.bo",
      "mercadolibre.com.ve",
    ],
  ],
  ["Mercado Livre", ["mercadolivre.com.br"]],
  ["Coolbox", ["coolbox.pe"]],
  ["Ripley", ["ripley.com.pe", "ripley.cl"]],
  ["Oechsle", ["oechsle.pe"]],
  ["Promart", ["promart.pe"]],
  [
    "Sodimac",
    [
      "sodimac.com.pe",
      "sodimac.cl",
      "sodimac.com.co",
      "sodimac.com.ar",
      "sodimac.com.br",
    ],
  ],
  ["La Curacao", ["lacuracao.pe"]],
  ["Hiraoka", ["hiraoka.com.pe"]],
  ["Plaza Vea", ["plazavea.com.pe"]],
  ["Wong", ["wong.pe"]],
  ["Éxito", ["exito.com"]],
  ["Liverpool", ["liverpool.com.mx"]],
  ["Magazine Luiza", ["magazineluiza.com.br"]],
];
export function giftStore(raw: string) {
  try {
    const host = new URL(raw).hostname.toLowerCase().replace(/^www\./, "");
    return (
      stores.find(([, domains]) =>
        domains.some(
          (domain) => host === domain || host.endsWith(`.${domain}`),
        ),
      )?.[0] || host
    );
  } catch {
    return "Ver tienda";
  }
}
