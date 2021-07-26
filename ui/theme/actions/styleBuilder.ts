import { css, SimpleInterpolation } from "styled-components";
import { InteractiveProps, VariantStates } from "../colors";
import { createThemeTarget, ThemeTarget } from "../themeTarget";

type ColorFormat = string;
export function variantToStyles(colorsForVariant: VariantStates<ColorFormat>): ThemeTarget {
  return createThemeTarget(css`
    ${stateToStyles(colorsForVariant.default)}

    &:hover {
      ${stateToStyles(colorsForVariant.hover)}
    }

    &:active {
      ${stateToStyles(colorsForVariant.active)}
    }

    &:disabled {
      ${stateToStyles(colorsForVariant.disabled)}
    }
  `);
}

function stateToStyles(colorsForState?: Partial<InteractiveProps<ColorFormat>>): SimpleInterpolation {
  if (!colorsForState) {
    return css``;
  }

  return css`
    ${colorsForState.text ??
    css`
      color: ${colorsForState.text};
    `}

    ${colorsForState.background ??
    css`
      background-color: ${colorsForState.background};
    `}
    
    ${colorsForState.icon ??
    css`
      svg {
        color: ${colorsForState.icon};
      }
    `}

    ${colorsForState.border ??
    css`
      border-color: ${colorsForState.border};
    `}
  `;
}
