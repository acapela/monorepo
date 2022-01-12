import { css } from "styled-components";

import { theme } from "@aca/ui/theme";

export const buttonKindMap = {
  primary: css`
    ${theme.colors.action.primary.withBorder.interactive}
  `,
  primarySubtle: css`
    ${theme.colors.action.primary.opacity(0.05).asBg};
    &:hover {
      ${theme.colors.action.primary.opacity(0.1).asBg};
    }
    ${theme.colors.action.primary.asColor};
  `,
  secondary: css`
    ${theme.colors.action.secondary.withBorder.interactive}
  `,
  transparent: css`
    ${theme.colors.action.transparent.interactive}
  `,
  backgroundAccent: css`
    ${theme.colors.layout.backgroundAccent.interactive};
  `,
};

export type ButtonKind = keyof typeof buttonKindMap;

export function getButtonKindtyles(variant: ButtonKind) {
  return buttonKindMap[variant];
}

export const buttonSizeMap = {
  regular: css`
    ${theme.box.button};
  `,
  compact: css`
    ${theme.box.compactButton};
  `,
  link: css`
    ${theme.box.linkButton};
    ${theme.font.medium};
  `,
};

export type ButtonSize = keyof typeof buttonSizeMap;

export function getButtonSizeStyles(variant: ButtonSize) {
  return buttonSizeMap[variant];
}
