import { StylesPart, css } from "styled-components";

import { theme } from "~ui/theme";

import { ButtonKind, ButtonSize } from "./types";

export const buttonSizeSpecificStyle: Partial<Record<ButtonSize, StylesPart>> = {
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

export const buttonKindSpecificStyle: Partial<Record<ButtonKind, StylesPart>> = {
  primary: css`
    ${theme.colors.action.primary.interactive}
  `,
  secondary: css`
    border-style: solid;
    border-width: 1.5px;

    ${theme.colors.action.secondary.interactive}
  `,
  tertiary: css`
    ${theme.colors.action.secondary.interactive}
  `,

  // TODO: Remove most transparent buttons and create a new component for remaining non-button components
  transparent: css`
    ${theme.typo.content.secondary}

    background: transparent;
    ${theme.colors.text.asColor};

    svg {
      ${theme.colors.text.asColor};
    }

    &:hover {
      ${theme.typo.content.secondary};
      ${theme.colors.layout.background.hover.asBg}
      svg {
        ${theme.colors.text.asColor};
      }
    }
  `,
};
