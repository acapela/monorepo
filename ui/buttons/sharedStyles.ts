import { FlattenSimpleInterpolation, css } from "styled-components";
import { theme } from "~ui/theme";
import { ButtonSize, ButtonKind } from "./types";

export const buttonSizeSpecificStyle: Partial<Record<ButtonSize, FlattenSimpleInterpolation>> = {
  small: css`
    font-size: 12px;
    padding: 10px 8px;
    gap: 4px;
  `,
  medium: css`
    font-size: 14px;
    padding: 12px;
    gap: 8px;

    svg {
      /* specific font size to match the design */
      font-size: 1.14;
    }
  `,
  large: css`
    font-size: 16px;
    padding: 18px 16px;
    gap: 8px;

    svg {
      /* specific font size to match the design */
      font-size: 1.25;
    }
  `,
};

export const activeTransparentButtonStyles = css`
  color: ${theme.colors.layout.bodyText};
  background: ${theme.colors.interactive.selected};

  svg {
    color: ${theme.colors.interactive.active};
  }
`;

export const buttonKindSpecificStyle: Partial<Record<ButtonKind, FlattenSimpleInterpolation>> = {
  primary: css`
    ${theme.colors.actions.primary.all()}
    ${theme.shadow.button}
  `,
  secondary: css`
    border-style: solid;
    border-width: 1.5px;

    ${theme.colors.actions.secondary.all()}
    ${theme.shadow.button}
  `,
  tertiary: css`
    ${theme.colors.actions.tertiary.all()}
    ${theme.shadow.button}
  `,

  // TODO: Remove most transparent buttons and create a new component for remaining non-button components
  transparent: css`
    ${theme.font.inter.normal.build}

    background: transparent;
    color: ${theme.colors.layout.supportingText};

    svg {
      color: ${theme.colors.layout.supportingText};
    }

    &:hover {
      color: ${theme.colors.layout.bodyText};
      background: ${theme.colors.interactive.selected};
      svg {
        color: ${theme.colors.layout.bodyText};
      }
    }

    &:active {
      ${activeTransparentButtonStyles};
    }
  `,
};
