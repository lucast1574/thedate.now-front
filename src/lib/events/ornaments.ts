export type OrnamentFamily =
  "botanical" | "romance" | "gala" | "editorial" | "fiesta" | "coastal";
// Editable artwork, independent of interface icons. Raster provenance: public/templates/art/SOURCE.txt.
export const ornaments = [
  {
    id: "floral-corner",
    name: "Rincón de flores",
    family: "botanical",
    path: "",
    asset: "/templates/art/floral-corner.png",
  },
  {
    id: "floral-stem",
    name: "Ramo de ceremonia",
    family: "botanical",
    path: "",
    asset: "/templates/art/floral-stem.png",
  },
  {
    id: "olive",
    name: "Rama de olivo",
    family: "botanical",
    path: "M96 190C95 130 111 78 137 12M99 164C60 161 42 140 45 120C73 120 96 139 99 164ZM105 131C135 133 161 113 164 91C133 91 113 108 105 131ZM113 98C82 91 65 67 70 48C97 54 113 73 113 98ZM126 59C150 59 168 42 171 20C148 22 132 37 126 59",
  },
  {
    id: "wildflower",
    name: "Flor de jardín",
    family: "botanical",
    path: "M99 194C112 145 98 116 100 80M103 150C71 149 59 131 53 115C81 115 99 128 103 150M106 129C132 130 150 116 155 99C130 98 112 112 106 129M100 76C68 85 57 62 70 48C45 25 74 9 92 34C99 5 125 13 120 39C148 22 166 48 137 60C162 83 136 102 115 80C111 107 83 102 100 76ZM99 54C91 52 87 62 94 68C102 75 113 63 106 57Z",
  },
  {
    id: "ribbon",
    name: "Lazo de seda",
    family: "romance",
    path: "M99 73C71 24 15 26 25 57C33 80 66 88 99 73ZM101 73C129 24 185 26 175 57C167 80 134 88 101 73ZM94 72Q101 64 107 72L107 85Q101 91 94 84ZM94 85C84 118 59 147 62 181L83 164L94 184C88 149 109 119 103 85M109 85C129 113 132 145 149 160L145 136L167 141C142 119 128 104 109 85",
  },
  {
    id: "cameo",
    name: "Marco de camafeo",
    family: "romance",
    path: "M100 8C145 8 183 46 183 100S145 192 100 192S17 154 17 100S55 8 100 8ZM100 17C139 17 174 51 174 100S139 183 100 183S26 149 26 100S61 17 100 17M88 9Q100 32 112 9M88 191Q100 168 112 191M18 88Q42 100 18 112M182 88Q158 100 182 112",
  },
  {
    id: "deco",
    name: "Abanico art déco",
    family: "gala",
    path: "M100 184L15 80L31 55L48 35L72 20L100 12L128 20L152 35L169 55L185 80ZM100 184L31 55M100 184L48 35M100 184L72 20M100 184V12M100 184L128 20M100 184L152 35M100 184L169 55M35 104Q100 35 165 104M50 122Q100 68 150 122M66 142Q100 108 134 142",
  },
  {
    id: "crest",
    name: "Escudo de gala",
    family: "gala",
    path: "M100 12Q139 35 179 29L169 117Q153 158 100 190Q47 158 31 117L21 29Q61 35 100 12ZM100 25Q137 44 165 41L156 113Q139 147 100 175Q61 147 44 113L35 41Q63 44 100 25M75 44L100 62L125 44M85 148L100 137L115 148",
  },
  {
    id: "orbit",
    name: "Órbita editorial",
    family: "editorial",
    path: "M100 18A82 82 0 1 0 100 182A82 82 0 1 0 100 18M18 100H182M100 18C49 60 49 140 100 182C151 140 151 60 100 18M33 53Q100 89 167 53M33 147Q100 111 167 147",
  },
  {
    id: "ticket",
    name: "Entrada recortada",
    family: "editorial",
    path: "M12 32H188V70C166 70 166 104 188 104V168H12V104C34 104 34 70 12 70ZM140 33V48M140 60V75M140 87V102M140 114V129M140 141V167M30 48H118M30 150H118",
  },
  {
    id: "burst",
    name: "Sol de celebración",
    family: "fiesta",
    path: "M100 8L111 65L146 20L130 73L180 54L139 90L192 100L139 111L180 146L130 129L146 180L111 139L100 192L89 139L54 180L71 129L20 146L61 111L8 100L61 89L20 54L71 73L54 20L89 65ZM100 77A23 23 0 1 0 100 123A23 23 0 1 0 100 77",
  },
  {
    id: "streamer",
    name: "Cinta de fiesta",
    family: "fiesta",
    path: "M35 8C140 26 169 80 107 98C48 116 35 59 84 52C147 43 194 123 129 150C77 172 99 188 164 192M31 20C128 34 147 72 103 85C64 98 56 70 87 64C134 57 174 115 124 138C63 166 84 197 164 198",
  },
  {
    id: "shell",
    name: "Concha mediterránea",
    family: "coastal",
    path: "M100 180L22 109Q6 85 27 69Q20 41 48 38Q53 12 79 25Q100 1 121 25Q147 12 152 38Q180 41 173 69Q194 85 178 109ZM100 180L27 69M100 180L48 38M100 180L79 25M100 180L121 25M100 180L152 38M100 180L173 69M80 183Q100 194 120 183",
  },
  {
    id: "tides",
    name: "Olas del horizonte",
    family: "coastal",
    path: "M5 70C40 25 65 115 100 70S160 25 195 70M5 90C40 45 65 135 100 90S160 45 195 90M5 110C40 65 65 155 100 110S160 65 195 110M5 130C40 85 65 175 100 130S160 85 195 130",
  },
] as const;
export const ornamentFamilies: Record<OrnamentFamily, string> = {
  botanical: "Jardín botánico",
  romance: "Cartas y seda",
  gala: "Noche de gala",
  editorial: "Estudio editorial",
  fiesta: "Fiesta gráfica",
  coastal: "Costa mediterránea",
};
export function ornamentById(id = "") {
  return ornaments.find((item) => `art:${item.id}` === id);
}
