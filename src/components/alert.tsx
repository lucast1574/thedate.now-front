import { useTranslator } from "@/lib/i18n/react";
import type { ReactNode } from "react";

export default function Alert({
  children,
  variant = "error",
}: {
  children: ReactNode;
  variant?: "error" | "success";
}) {
  const i18n = useTranslator();
  if (!children) return null;
  return (
    <p className={`alert ${variant}`}>
      {typeof children === "string" ? i18n(children) : children}
    </p>
  );
}
