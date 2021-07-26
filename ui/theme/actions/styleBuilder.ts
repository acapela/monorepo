import { css, FlattenSimpleInterpolation, SimpleInterpolation } from "styled-components";
import { InteractiveProps, VariantStates } from "../colors";

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

function stateToStyles(colorsForState?: Partial<InteractiveProps>): SimpleInterpolation {
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
