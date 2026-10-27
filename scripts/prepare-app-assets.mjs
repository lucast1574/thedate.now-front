import { cp, mkdir } from "node:fs/promises";
const name = process.argv[2];
if (!["the-date", "save-the-date"].includes(name))
  throw new Error("Unknown application");
await mkdir(new URL(`../apps/${name}/public`, import.meta.url), {
  recursive: true,
});
await cp(
  new URL("../public", import.meta.url),
  new URL(`../apps/${name}/public`, import.meta.url),
  { recursive: true },
);
