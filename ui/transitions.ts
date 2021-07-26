import { css } from "styled-components";
import { changeColorLightness, isColorDark } from "~shared/colors";
import { BUTTON_ACCENT_COLOR, WHITE } from "./theme/colors/base";

export function hoverTransition(propName = "all") {
  return css`
    transition: 0.35s ${propName};

    /* Make transition faster on hover to have effect of 'quick' trigger and slow release. */
    &:hover {
      transition: 0.075s ${propName};
    }
  `;
}

export const ACTION_ACTIVE_COLOR = "rgb(136 136 136 / 10%)";

export const hoverActionActiveCss = css`
  background-color: ${ACTION_ACTIVE_COLOR};
`;

export const hoverActionNegativeSpacingCss = css`
  padding: 0.75rem;
  margin: -0.75rem;
`;

export const hoverActionCss = css`
  ${hoverTransition()}

  &:hover {
    ${hoverActionActiveCss};
  }
`;

const HOVER_COLOR_CHANGE = 5;

export function getColorHoverVariant(color: string, ratio = 1): string {
  if (isColorDark(color)) {
    return changeColorLightness(color, HOVER_COLOR_CHANGE * ratio);
  }

  return changeColorLightness(color, -HOVER_COLOR_CHANGE * ratio);
}

export function getColorActiveVariant(color: string): string {
  if (isColorDark(color)) {
    return changeColorLightness(color, HOVER_COLOR_CHANGE * 1.5);
  }

  return changeColorLightness(color, -HOVER_COLOR_CHANGE * 1.5);
}

export function getTextColorForBackgroundColor(color: string): string {
  if (isColorDark(color)) {
    return WHITE;
  }

  return BUTTON_ACCENT_COLOR;
}

export function getButtonColorStyles(baseBgColor: string) {
  const hoverColor = getColorHoverVariant(baseBgColor);
  const activeColor = getColorActiveVariant(baseBgColor);
  const textColor = getTextColorForBackgroundColor(baseBgColor);

  return css`
    ${hoverTransition()}
    background-color: ${baseBgColor};
    color: ${textColor};

    &:hover {
      background-color: ${hoverColor};
      color: ${textColor};
    }

    &:active {
      background-color: ${activeColor};
      color: ${textColor};
    }
  `;
}
