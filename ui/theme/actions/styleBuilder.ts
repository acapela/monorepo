import { css, FlattenSimpleInterpolation, SimpleInterpolation } from "styled-components";
import { ColorTargetOptions, VariantStates } from "../colors";

export interface ActionStateInterpolations {
  regular: () => FlattenSimpleInterpolation;
  hover: () => FlattenSimpleInterpolation;
  disabled: () => FlattenSimpleInterpolation;
  active: () => FlattenSimpleInterpolation;
  all: () => FlattenSimpleInterpolation;
}

export function variantToStyles(colorsForVariant: VariantStates): ActionStateInterpolations {
  const result: ActionStateInterpolations = {
    regular() {
      return css`
        ${stateToStyles(colorsForVariant.regular)}
      `;
    },
    hover() {
      return css`
        ${stateToStyles(colorsForVariant.hover)}
      `;
    },
    disabled() {
      return css`
        ${stateToStyles(colorsForVariant.disabled)}
      `;
    },
    active() {
      return css`
        ${stateToStyles(colorsForVariant.active)}
      `;
    },
    all() {
      return css`
        ${result.regular()}

        &:hover {
          ${result.hover()}
        }

        &:active {
          ${result.active()}
        }

        &:disabled {
          ${result.disabled()}
        }
      `;
    },
  };

  return result;
}

function stateToStyles(colorsForState?: Partial<ColorTargetOptions>): SimpleInterpolation {
  if (!colorsForState) {
    return css``;
  }

  const { text, background, icon, border } = colorsForState;

  return css`
    ${text
      ? css`
          color: ${text()};
        `
      : ""}

    ${background
      ? css`
          background-color: ${background()};
        `
      : ""}
    
    ${icon
      ? css`
          svg {
            color: ${icon()};
          }
        `
      : ""}

    ${border
      ? css`
          border-color: ${border()};
        `
      : ""}
  `;
}
