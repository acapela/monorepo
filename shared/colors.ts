import Color from "color";

export function setColorOpacity(color: string, opacity: number): string {
  const colorInstance = new Color(color);
  return colorInstance
    .hsl()
    .fade(1 - opacity)
    .rgb()
    .toString();
}
