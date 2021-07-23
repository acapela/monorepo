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

export function color(inputColor: string): Color {
  const resultColor: Color = {
    hover(ratio) {
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
