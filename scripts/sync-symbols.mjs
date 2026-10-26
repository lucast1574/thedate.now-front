import { format } from "prettier";
import fs from "node:fs";
const source = "node_modules/lucide-static/";
const { version } = JSON.parse(
  fs.readFileSync(source + "package.json", "utf8"),
);
if (version !== "1.61.0")
  throw new Error(
    "Update the sprite URL in Icon and the invitation runtime allowlist before changing Lucide versions.",
  );
const tags = JSON.parse(fs.readFileSync(source + "tags.json", "utf8"));
fs.mkdirSync("public/symbols", { recursive: true });
fs.copyFileSync(
  source + "sprite.svg",
  `public/symbols/lucide-${version.slice(0, -2)}.svg`,
);
fs.copyFileSync(source + "LICENSE", "public/symbols/LUCIDE-LICENSE.txt");
fs.writeFileSync(
  "src/lib/events/symbol-catalog.json",
  await format(JSON.stringify(tags), { parser: "json" }),
);
fs.writeFileSync(
  "../backend/internal/core/lucide-symbols.json",
  JSON.stringify(Object.keys(tags)) + "\n",
);
console.log(
  `Synced ${Object.keys(tags).length} Lucide symbols to both projects.`,
);
