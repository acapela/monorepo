import { assert } from "~shared/assert";
import { setColorOpacity } from "~shared/colors";

function asNumber(val: unknown, modifierName: string): number {
  assert(val && typeof val === "number", `Input for color ${modifierName} modifier must be number`);
  return val as number;
}

const modifiers: Record<string, Modifier> = {
  opacity: (value?: string | number) => (fromColor: Color) => setColorOpacity(fromColor, asNumber(value, "opacity")),
};

type Color = string;
export type Modifiers = Record<string, Modifier>;
type Modifier = (param?: string | number) => (fromColor: Color) => Color;

export type ColorGetter = (modifier?: (mods: Record<string, Modifier>) => Array<(color: Color) => Color>) => Color;

/*
 *  The create color function wraps the color inside a method that allows us to do modifications when required.
 *
 *  const color = createColor("hsl(100%, 100%, 50%, 1)");
 *
 *  color() // returns "hsl(100%, 100%, 50%, 1)"
 *  color((modifiers: Modifiers) => [ modifiers.opacity(0.5) ]) // returns "hsl(100%, 100%, 50%, 0.5)"
 *
 *  Using multiple modifiers are possible. Modifiers will modify the output of previous change to
 *  colors serially left to right.
 *
 *  Example:
 *  const color = createColor("hsl(100%, 100%, 50%, 1)");
 *
 *  color((modifiers: Modifiers) => [
 *    modifiers.hue("50%"),            // input: "hsl(100%, 100%, 50%, 1)"; output: "hsl(50%, 100%, 50%, 1)";
 *    modifiers.saturation("0%"),      // input: "hsl(50%, 100%, 50%, 1)"; output: "hsl(50%, 0%, 50%, 1)";
 *    modifiers.opacity(0.5)           // input: "hsl(50%, 0%, 50%, 1)"; output: "hsl(50%, 0%, 50%, 0.5)";
 *  ])
 *
 *
 *  Usage with themes
 *  background-color: ${theme.colors.status.warning((modifiers: Modifiers) => [ modifiers.opacity("0.5") ])};
 *
 */
export function createColor(color: Color): ColorGetter {
  return function (modifierHandler?: (mods: Record<string, Modifier>) => Array<(color: Color) => Color>): Color {
    if (modifierHandler) {
      return modifierHandler(modifiers).reduce((resultingColor, nextModifier) => nextModifier(resultingColor), color);
    }
    return color;
  };
}
