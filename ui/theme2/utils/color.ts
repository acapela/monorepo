import { CSSProperties } from "react";
import { StylesPart, css } from "styled-components";

import { changeColorLightness, isColorDark, setColorOpacity } from "~/shared/colors";
import { Thunk, resolveThunk } from "~/shared/thunk";

import { ThemeTarget, createThemeTarget } from "./themeTarget";

type CssPropertyName = keyof CSSProperties;

type ColorVariants = {
  value: string;

  opacity(ratio?: number): Color;
  secondary: Color;
  tertiary: Color;

  asBg: StylesPart;
  asBgWithReadableText: StylesPart;
  asColor: StylesPart;
  asStyle(property: CssPropertyName): StylesPart;

  hover: Color;
  active: Color;
  interactive(property: CssPropertyName): StylesPart;

  border: Color;

  readableText: Color;
};

export type Color = ThemeTarget<ColorVariants>;

interface ColorPredefinedVariants {
  hover?: Thunk<Color>;
  active?: Thunk<Color>;
  border?: Thunk<Color>;
  readableText?: Thunk<Color>;
}

export function color(input: string, config: ColorPredefinedVariants = {}): Color {
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
        return color(input).asStyle("backgroundColor");
      },
      get asColor() {
        return color(input).asStyle("color");
      },
      get asBgWithReadableText() {
        return css`
          ${self.asBg};
          ${self.readableText.asColor};
        `;
      },
      get hover() {
        return resolveThunk(config.hover) ?? color(getColorHoverVariant(input));
      },
      get active() {
        return resolveThunk(config.active) ?? color(getColorActiveVariant(input));
      },
      get border() {
        return resolveThunk(config.border) ?? getColorBorderVariant(input);
      },
      get readableText() {
        return resolveThunk(config.readableText) ?? getColorReadableText(input);
      },
      get secondary() {
        return color(setColorOpacity(input, 0.8));
      },
      get tertiary() {
        return color(setColorOpacity(input, 0.8));
      },
      asStyle(property: CssPropertyName) {
        return css`
          ${{ [property]: input }};
        `;
      },
      interactive(property: CssPropertyName) {
        return css`
          ${self.asStyle(property)};
          &:hover {
            ${self.hover.asStyle(property)};
          }
          &:active {
            ${self.active.asStyle(property)};
          }
        `;
      },
      opacity(ratio = 1) {
        return color(setColorOpacity(input, ratio));
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
