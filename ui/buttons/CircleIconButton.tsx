import { ReactNode } from "react";
import styled, { css, StylesPart } from "styled-components";
import { theme } from "~ui/theme";
import { ButtonKind, ButtonSize } from "./types";

export interface Props {
  icon: ReactNode;
  size?: ButtonSize;
  kind?: ButtonKind;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
  isDisabled?: boolean;
  iconSizeRatio?: number;
}

/**
 * By default icon occupy 0.75 of circle size. It might 'look' good for various icons or use cases to modify this ratio.
 * eg. 0.5 means if circle has 32px size, icon will have 16px size.
 */
const DEFAULT_ICON_SIZE_RATIO = 0.75;

export const CircleIconButton = styled(function CircleIconButton({
  icon,
  size = "small",
  kind = "tertiary",
  onClick,
  className,
  tooltip,
  isDisabled = false,
  iconSizeRatio = DEFAULT_ICON_SIZE_RATIO,
}: Props) {
  return (
    <UIButton
      data-tooltip={tooltip}
      className={className}
      onClick={onClick}
      size={size}
      kind={kind}
      isDisabled={isDisabled}
      disabled={isDisabled}
      iconSizeRatio={iconSizeRatio}
    >
      {icon}
    </UIButton>
  );
})``;

const buttonSizeSpecificStyle: Record<ButtonSize, StylesPart> = {
  small: css<{}>`
    font-size: 24px;
  `,
  medium: css<{}>`
    font-size: 30px;
  `,
  large: css<{}>`
    font-size: 36px;
  `,
  inherit: css<{}>`
    font-size: inherit;
  `,
};

const buttonKindSpecificStyle: Partial<Record<ButtonKind, StylesPart>> = {
  primary: css<{}>`
    ${theme.colors.actions.primary.all()}
    border: 1px solid transparent;
  `,
  secondary: css<{}>`
    ${theme.colors.actions.secondary.all()}
    border: 1px solid transparent;
  `,
  tertiary: css<{}>`
    ${theme.colors.actions.tertiary.all()}
    border: 1px solid transparent;
  `,
  transparent: css<{}>`
    background: transparent;

    &:hover,
    &:active {
      ${theme.colors.actions.secondary.hover()}
    }
  `,
};

export const UIButton = styled.button<{
  size: ButtonSize;
  kind: ButtonKind;
  isDisabled: boolean;
  iconSizeRatio: number;
}>`
  padding: 0;
  width: 1em;
  height: 1em;

  display: flex;
  align-items: center;
  justify-content: center;

  ${({ kind }) => buttonKindSpecificStyle[kind]}
  ${({ size }) => buttonSizeSpecificStyle[size]};

  ${theme.borderRadius.circle};
  ${theme.transitions.hover()}

  svg {
    font-size: ${(props) => props.iconSizeRatio}em;
  }

  ${(props) =>
    !props.isDisabled &&
    css<{}>`
      cursor: pointer;
    `};
`;
