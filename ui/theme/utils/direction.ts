export type StrictDirection = "top" | "bottom" | "left" | "right";

export type AxisDirection = "vertical" | "horizontal";

export type AllDirections = "all";

export type Direction = StrictDirection | AxisDirection | AllDirections;

export function resolveDirection(direction: Direction): StrictDirection[] {
  if (direction === "all") return ["top", "bottom", "left", "right"];

  if (direction === "vertical") return ["top", "bottom"];

  if (direction === "horizontal") return ["left", "right"];

  return [direction];
}
