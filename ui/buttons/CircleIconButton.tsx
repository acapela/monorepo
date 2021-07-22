import { ReactNode } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { CLOUD_LIGHTER, DARK_ONYX, BASE_GREY_4, BASE_GREY_6, PRIMARY_PINK_1 } from "~ui/colors";
import { squareStyle } from "~ui/styleHelpers";
import { hoverTransition } from "~ui/transitions";

type ButtonSize = "small" | "medium" | "large";
type ButtonKind = "secondary" | "transparent";

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
  kind = "secondary",
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
    >
      {icon}
    </UIButton>
  );
})``;

const buttonSizeSpecificStyle: Record<ButtonSize, FlattenSimpleInterpolation> = {
  small: css`
    ${squareStyle(24)}
  `,
  medium: css`
    ${squareStyle(32)}
  `,
  large: css`
    ${squareStyle(36)}
  `,
};

const buttonKindSpecificStyle: Record<ButtonKind, FlattenSimpleInterpolation> = {
  secondary: css`
    background: ${CLOUD_LIGHTER};
    border: 1px solid transparent;
  `,
  transparent: css`
    background: transparent;
  `,
};

const buttonKindSpecificInteractionStyle: Record<ButtonKind, FlattenSimpleInterpolation> = {
  secondary: css`
    &:hover {
      background: ${BASE_GREY_4};
    }
    &:active {
      background: ${CLOUD_LIGHTER};
      border-color: ${PRIMARY_PINK_1};
    }
  `,
  transparent: css`
    &:hover {
      background: ${BASE_GREY_6};
    }
    &:active {
      background: ${BASE_GREY_6};
    }
  `,
};

export const UIButton = styled.button<{ size: ButtonSize; kind: ButtonKind; isDisabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${borderRadius.circle};
  font-size: 16px;
  color: ${DARK_ONYX};
  padding: 0;

  ${({ size }) => buttonSizeSpecificStyle[size]}
  ${({ kind }) => buttonKindSpecificStyle[kind]}

  ${(props) =>
    !props.isDisabled &&
    css`
      cursor: pointer;
      ${hoverTransition()}
      ${buttonKindSpecificInteractionStyle[props.kind]}
    `};
`;
