import { css } from "styled-components";

import { theme } from "@aca/ui/theme";

export const buttonKindMap = {
  primary: css`
    ${theme.colors.action.primary.withBorder.interactive}
  `,
  primarySubtle: css`
    ${theme.colors.action.primary.withBorder.opacity(0.05).asBg};
    &:hover {
      ${theme.colors.action.primary.opacity(0.1).asBg};
    }
    ${theme.colors.action.primary.asColor};
  `,
  secondary: css`
    ${theme.colors.action.secondary.withBorder.interactive}
  `,
  tertiary: css`
    ${theme.colors.layout.background.withBorder.interactive}
  `,
  transparent: css`
    ${theme.colors.action.transparent.interactive};
    color: inherit;
  `,
  backgroundAccent: css`
    ${theme.colors.layout.backgroundAccent.interactive};
  `,
  danger: css`
    ${theme.colors.status.danger.interactive};
  `,
  warning: css`
    ${theme.colors.status.warning.interactive};
  `,
};

export type ButtonKind = keyof typeof buttonKindMap;

export function getButtonKindStyles(variant: ButtonKind) {
  return buttonKindMap[variant];
}

export type ButtonSize = keyof typeof theme.box.control;

export function getButtonSizeStyles(variant: ButtonSize) {
  return theme.box.control[variant].padding.radius.size;
}
