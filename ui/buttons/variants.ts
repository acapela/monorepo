import { css } from "styled-components";

import { theme } from "~ui/theme";

export const buttonKindMap = {
  primary: css`
    ${theme.colors.action.primary.withBorder.interactive}
  `,
  secondary: css`
    ${theme.colors.action.secondary.withBorder.interactive}
  `,
  transparent: css`
    ${theme.colors.action.transparent.interactive}
  `,
};

export type ButtonKind = keyof typeof buttonKindMap;

export function getButtonKindtyles(variant: ButtonKind) {
  return buttonKindMap[variant];
}
