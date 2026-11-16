import type { ReactNode } from "react";
import type { Choice, listboxPosition } from "@/lib/ui/listbox";
export type ListboxPopup = {
  position: ReturnType<typeof listboxPosition>;
  title: string;
  general: boolean;
  editor?: boolean;
  container: Element;
};
export type ListboxProps = {
  children: ReactNode;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
  renderLabel?: (option: Choice, selected: boolean) => ReactNode;
  menuMinWidth?: number;
};
