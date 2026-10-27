import type { NextRequest } from "next/server";
import { proxy as sharedProxy } from "@/proxy";
export function proxy(request: NextRequest) {
  return sharedProxy(request);
}
