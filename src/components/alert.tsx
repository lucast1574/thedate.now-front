import type { ReactNode } from "react";

export default function Alert({
  children,
  variant = "error",
}: {
  children: ReactNode;
  variant?: "error" | "success";
}) {
  if (!children) return null;
  return <p className={`alert ${variant}`}>{children}</p>;
}
