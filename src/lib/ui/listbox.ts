import { Children, isValidElement, type ReactNode } from "react";
export type Choice = { value: string; label: string; disabled?: boolean };
export function moveChoice(
  options: Choice[],
  current: number,
  direction: number,
) {
  if (!options.length) return -1;
  for (let step = 1; step <= options.length; step++) {
    const index =
      (current + direction * step + options.length * 2) % options.length;
    if (!options[index].disabled) return index;
  }
  return -1;
}
export function findChoice(options: Choice[], query: string, current: number) {
  const normalized = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es");
  for (let step = 1; step <= options.length; step++) {
    const index = (current + step + options.length) % options.length;
    if (
      !options[index].disabled &&
      normalized(options[index].label).startsWith(normalized(query))
    )
      return index;
  }
  return current;
}
export function listboxPosition(
  rect: { top: number; bottom: number; left: number; width: number },
  width: number,
  height: number,
) {
  const below = height - rect.bottom - 12,
    above = rect.top - 12;
  const upward = below < 180 && above > below;
  return {
    left: Math.max(8, Math.min(rect.left, width - rect.width - 8)),
    width: Math.min(rect.width, width - 16),
    maxHeight: Math.max(40, Math.min(280, upward ? above : below)),
    ...(upward ? { bottom: height - rect.top + 6 } : { top: rect.bottom + 6 }),
  };
}

export function optionChoices(children: ReactNode): Choice[] {
  return Children.toArray(children)
    .filter(isValidElement)
    .map((child) => {
      const props = child.props as {
        value: string;
        children: ReactNode;
        disabled?: boolean;
      };
      return {
        value: props.value,
        label: Children.toArray(props.children).join(""),
        disabled: props.disabled,
      };
    });
}
