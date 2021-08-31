import { assert } from "~shared/assert";
import { changeColorLightness, setColorOpacity } from "~shared/colors";
import { createTypeGuard } from "~shared/typeUtils/typeGuard";

function asNumber(val: unknown, modifierName: string): number {
  assert(val && typeof val === "number", `Input for color ${modifierName} modifier must be number`);
  return val as number;
}

const modifiers = createTypeGuard<Record<string, ColorModifier>>()({
  opacity: (value) => (fromColor) => setColorOpacity(fromColor, asNumber(value, "opacity")),
  lighten: (offset) => (fromColor) => changeColorLightness(fromColor, asNumber(offset, "offset")),
});

type Color = string;
export type ColorModifiers = typeof modifiers;
type ColorModifier = (param?: string | number) => (fromColor: Color) => Color;

export type ColorGetter = (modifier?: (mods: ColorModifiers) => Array<(color: Color) => Color>) => Color;

/*
 *  The create color function wraps the color inside a method that allows us to do modifications when required.
 *
 *  const color = createColor("hsl(100%, 100%, 50%, 1)");
 *
 *  color() // returns "hsl(100%, 100%, 50%, 1)"
 *  color((modifiers) => [ modifiers.opacity(0.5) ]) // returns "hsl(100%, 100%, 50%, 0.5)"
 *
 *  Using multiple modifiers are possible. Modifiers will modify the output of previous change to
 *  colors serially left to right.
 *
 *  Example:
 *  const color = createColor("hsl(100%, 100%, 50%, 1)");
 *
 *  color((modifiers) => [
 *    modifiers.hue("50%"),            // input: "hsl(100%, 100%, 50%, 1)"; output: "hsl(50%, 100%, 50%, 1)";
 *    modifiers.saturation("0%"),      // input: "hsl(50%, 100%, 50%, 1)"; output: "hsl(50%, 0%, 50%, 1)";
 *    modifiers.opacity(0.5)           // input: "hsl(50%, 0%, 50%, 1)"; output: "hsl(50%, 0%, 50%, 0.5)";
 *  ])
 *
 *
 *  Usage with themes
 *  background-color: ${theme.colors.status.warning((modifiers) => [ modifiers.opacity("0.5") ])};
 *
 */
export function createColor(color: Color): ColorGetter {
  return function (modifierHandler?: (mods: ColorModifiers) => Array<(color: Color) => Color>): Color {
    if (modifierHandler) {
      if (typeof modifierHandler !== "function") {
        console.warn(`Color modifier handler is not a function`, { modifierHandler });
        return color;
      }
      return modifierHandler(modifiers).reduce((resultingColor, nextModifier) => nextModifier(resultingColor), color);
    }
    return color;
  };
}
