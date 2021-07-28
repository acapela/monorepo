import { ReactNode } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
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
}

export const CircleIconButton = styled(function CircleIconButton({
  icon,
  size = "small",
  kind = "tertiary",
  onClick,
  className,
  tooltip,
  isDisabled = false,
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
    >
      {icon}
    </UIButton>
  );
})``;

const buttonSizeSpecificStyle: Record<ButtonSize, FlattenSimpleInterpolation> = {
  small: css`
    font-size: 24px;
  `,
  medium: css`
    font-size: 30px;
  `,
  large: css`
    font-size: 36px;
  `,
  inherit: css`
    font-size: inherit;
  `,
};

const buttonKindSpecificStyle: Partial<Record<ButtonKind, FlattenSimpleInterpolation>> = {
  primary: css`
    ${theme.colors.actions.primary.all()}
    border: 1px solid transparent;
  `,
  secondary: css`
    ${theme.colors.actions.secondary.all()}
    border: 1px solid transparent;
  `,
  tertiary: css`
    ${theme.colors.actions.tertiary.all()}
    border: 1px solid transparent;
  `,
  transparent: css`
    background: transparent;

    &:hover,
    &:active {
      ${theme.colors.actions.secondary.hover()}
    }
  `,
};

export const UIButton = styled.button<{ size: ButtonSize; kind: ButtonKind; isDisabled: boolean }>`
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
    font-size: 0.75em;
  }

  ${(props) =>
    !props.isDisabled &&
    css`
      cursor: pointer;
    `};
`;
