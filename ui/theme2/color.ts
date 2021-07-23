import { css } from "styled-components";
import { createThemeTarget, ThemeTarget } from "./themeTarget";

type InteractionState = "hover" | "active";

type ColorProperty = "background-color" | "color";

interface Color extends ThemeTarget {
  hover(ratio: number): Color;
  active(ratio: number): Color;
  interactive(property: ColorProperty): ThemeTarget;
  on(property: ColorProperty): ThemeTarget;
}

interface ColorOptions {
  /**
   * It is possible to provide variants of the color here.
   *
   * It feels like a right place to do this as it is kinda 'knowledge of the color' what 'hover' color is matching it.
   *
   * This way we dont need to carry this knowledge when using this color and we have single source of truth about it:
   * "Primary color has always THIS hover and THIS active color, and if used as BACKGROUND, this text color will match it"
   */
  hoverVariant?: string;
  activeVariant?: string;
  textOnBackgroundColor?: string;
}

export function color(inputColor: string, options?: ColorOptions): Color {
  const resultColor: Color = {
    hover(ratio) {
      if (options?.hoverVariant) return color(options.hoverVariant);
      const modifiedColor = inputColor; // TODO;
      return color(modifiedColor);
    },
    active(ratio) {
      const modifiedColor = inputColor; // TODO;
      return color(modifiedColor);
    },
    interactive(property) {
      return createThemeTarget(css`
        ${resultColor.on(property)};

        &:hover {
          ${resultColor.hover().on(property)};
        }

        &:active {
          ${resultColor.active().on(property)};
        }
      `);
    },
    on(property) {
      return createThemeTarget(
        css`
          ${property}:${inputColor}
        `
      );
    },
    getStyles() {
      return createThemeTarget(
        css`
          ${inputColor}
        `
      );
    },
  };

  return resultColor;
}
