export function turnSeatingItem(angle: number, delta: number) {
  return ((((angle + delta + 180) % 360) + 360) % 360) - 180;
}
