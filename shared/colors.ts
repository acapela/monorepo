import Color from "color";

export function setColorOpacity(color: string, opacity: number): string {
  const colorInstance = new Color(color);
  return colorInstance
    .hsl()
    .fade(1 - opacity)
    .hsl()
    .toString();
}

export function isColorDark(color: string): boolean {
  const colorInstance = new Color(color);
  return colorInstance.isDark();
}

export function changeColorLightness(color: string, offset: number): string {
  const colorInstance = new Color(color);
  const currentLightness = colorInstance.lightness();

  return colorInstance
    .lightness(currentLightness + offset)
    .hsl()
    .toString();
}
