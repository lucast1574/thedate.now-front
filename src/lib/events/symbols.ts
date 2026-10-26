import catalog from "./symbol-catalog.json";
export const weddingSymbols = [
  "heart",
  "ring",
  "flower",
  "lucide:heart-handshake",
  "lucide:flower-2",
  "lucide:church",
  "lucide:wine",
  "lucide:gem",
  "lucide:hand-heart",
  "lucide:bird",
  "lucide:leaf",
  "lucide:ribbon",
  "lucide:mail",
  "lucide:party-popper",
  "lucide:camera",
  "lucide:eighth-notes",
];
export const eventSymbols = [
  "lucide:party-popper",
  "lucide:cake",
  "lucide:balloon",
  "lucide:ticket",
  "lucide:martini",
  "lucide:eighth-notes",
  "lucide:mic-vocal",
  "lucide:disc-3",
  "lucide:gift",
  "lucide:sparkle",
  "lucide:sparkles",
  "lucide:calendar-heart",
  "lucide:camera",
  "lucide:utensils",
  "lucide:glass-water",
  "lucide:map-pin",
];
export const symbolLabels: Record<string, string> = {
  heart: "Corazón",
  ring: "Anillos",
  flower: "Flor",
  sparkle: "Destello",
  star: "Estrella",
  music: "Música",
  "eighth-notes": "Música",
  frame: "Marco",
  arch: "Arco",
  leaf: "Rama",
  sunburst: "Sol",
  "heart-handshake": "Unión",
  "flower-2": "Flores",
  church: "Iglesia",
  wine: "Brindis",
  gem: "Diamante",
  "hand-heart": "Amor",
  bird: "Ave",
  ribbon: "Lazo",
  mail: "Carta de amor",
  "party-popper": "Celebración",
  camera: "Fotografía",
  cake: "Pastel",
  balloon: "Globo",
  ticket: "Entrada",
  martini: "Cóctel",
  "mic-vocal": "Micrófono",
  "disc-3": "Disco",
  gift: "Regalo",
  sparkles: "Destellos",
  "calendar-heart": "Fecha especial",
  utensils: "Cena",
  "glass-water": "Bebida",
  "map-pin": "Ubicación",
};
export function symbolLabel(id: string) {
  const name = id.replace("lucide:", "");
  return symbolLabels[name] || name.replaceAll("-", " ");
}
export const allSymbols = [
  ...Object.keys(catalog).map((name) => `lucide:${name}`),
  "heart",
  "ring",
  "flower",
  "sparkle",
  "star",
  "frame",
  "arch",
  "leaf",
  "sunburst",
];
export function symbolSearch(id: string) {
  const name = id.replace("lucide:", "");
  return [
    symbolLabel(id),
    name,
    ...(catalog[name as keyof typeof catalog] || []),
  ]
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const spanishTerms: Record<string, string> = {
  corazon: "heart",
  corazones: "heart",
  flores: "flower",
  flor: "flower",
  anillos: "ring",
  anillo: "ring",
  musica: "music",
  mapa: "map",
  ubicacion: "map",
  boda: "wedding",
  fiesta: "party",
  regalo: "gift",
  globos: "balloon",
  globo: "balloon",
  pastel: "cake",
  estrellas: "star",
  estrella: "star",
  flecha: "arrow",
  flechas: "arrow",
  hoja: "leaf",
  hojas: "leaf",
  arbol: "tree",
  sol: "sun",
  luna: "moon",
  casa: "house",
  iglesia: "church",
  comida: "food",
  copa: "wine",
  brindis: "wine",
  foto: "camera",
  fotografia: "camera",
  navidad: "christmas",
  amor: "heart",
  aves: "bird",
  ave: "bird",
};
export function symbolMatches(id: string, query: string) {
  const haystack = symbolSearch(id);
  return query
    .split(/\s+/)
    .every(
      (word) =>
        haystack.includes(word) ||
        haystack.includes(spanishTerms[word] || word),
    );
}
