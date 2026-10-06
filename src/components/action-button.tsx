import type { ButtonHTMLAttributes } from "react";

export default function ActionButton({
  className = "office-button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={className} {...props} />;
}
