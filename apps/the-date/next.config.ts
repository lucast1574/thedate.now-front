import type { NextConfig } from "next";
import path from "node:path";
const root = path.resolve(__dirname, "../..");
const config: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: root,
  turbopack: { root },
  env: { APP_PRODUCT: "general" },
};
export default config;
