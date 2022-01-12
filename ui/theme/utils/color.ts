import { CSSProperties } from "react";
import { StylesPart, css } from "styled-components";

import { changeColorLightness, isColorDark, setColorOpacity } from "@aca/shared/colors";
import { Thunk, resolveThunk } from "@aca/shared/thunk";

import { ThemeTarget, createThemeTarget } from "./themeTarget";

type CssPropertyName = keyof CSSProperties;

type ColorVariants = {
  value: string;

  opacity(ratio?: number): Color;
  secondary: Color;
  tertiary: Color;

  withBorder: Color;

  asBg: StylesPart;
  asBgWithReadableText: StylesPart;
  asColor: StylesPart;
  asStyle(property: CssPropertyName): StylesPart;

  hover: Color;
  active: Color;
  interactive: StylesPart;

  border: Color;

  readableText: Color;
};

export type Color = ThemeTarget<ColorVariants>;

interface ColorPredefinedVariants {
  hover?: Color;
  active?: Color;
  border?: Color;
  readableText?: Color;
}

interface State {
  hasBorder?: boolean;
}

export function color(input: string, config: Thunk<ColorPredefinedVariants> = {}, state: State = {}): Color {
  function flushFullstyles(styles: StylesPart): StylesPart {
    if (!state.hasBorder) {
      return styles;
    }

    return css`
      ${styles};
      border: 1px solid ${self.border};
    `;
  }

  const lazyConfig = {
    get resolve() {
      return resolveThunk(config);
    },
  };

  const self: Color = createThemeTarget<ColorVariants>(
    () =>
      css`
        ${input}
      `,
    {
      get value() {
        return input;
      },
      get asBg() {
        return self.asStyle("backgroundColor");
      },
      get asColor() {
        return self.asStyle("color");
      },
      get asBgWithReadableText() {
        return flushFullstyles(css`
          ${self.asBg};
          ${self.readableText.asColor};
        `);
      },
      get withBorder() {
        return color(input, config, { ...state, hasBorder: true });
      },
      get hover() {
        return lazyConfig.resolve.hover ?? color(getColorHoverVariant(input));
      },
      get active() {
        return lazyConfig.resolve.active ?? color(getColorActiveVariant(input));
      },
      get border() {
        return lazyConfig.resolve.border ?? getColorBorderVariant(input);
      },
      get readableText() {
        return lazyConfig.resolve.readableText ?? getColorReadableText(input);
      },
      get secondary() {
        return self.opacity(0.8);
      },
      get tertiary() {
        return self.opacity(0.6);
      },
      asStyle(property: CssPropertyName) {
        return flushFullstyles(css`
          ${{ [property]: input }};
        `);
      },
      get interactive() {
        return flushFullstyles(css`
          ${self.asBgWithReadableText};
          will-change: background-color;

          &:hover {
            ${self.hover.asBg};
          }
          &:active {
            ${self.active.asBg};
          }
        `);
      },
      opacity(ratio = 1) {
        return color(setColorOpacity(input, ratio), config, state);
      },
    }
  );

  return self;
}

const HOVER_COLOR_CHANGE = 5;

export function getColorLightnessVariant(color: string, ratio = 1): string {
  if (isColorDark(color)) {
    return changeColorLightness(color, ratio);
  }

  return changeColorLightness(color, -ratio);
}

export function getColorHoverVariant(color: string, ratio = 1): string {
  return getColorLightnessVariant(color, HOVER_COLOR_CHANGE * ratio);
}

export function getColorActiveVariant(color: string): string {
  return getColorLightnessVariant(color, HOVER_COLOR_CHANGE * 1.5);
}

const darkenerColor = color("hsla(0, 0%, 0%, 0.05)");
const lightenColor = color("hsla(0, 0%, 100%, 0.05)");

export function getColorBorderVariant(color: string) {
  if (isColorDark(color)) {
    return lightenColor;
  }

  return darkenerColor;
}

const white = color("hsl(0, 0%, 100%)");

const black = color("hsl(0, 0%, 0%)");

export function getColorReadableText(color: string) {
  if (isColorDark(color)) {
    return white;
  }

  return black;
}
