import { ReactNode } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { CLOUD_LIGHTER, DARK_ONYX, BASE_GREY_4, BASE_GREY_6, PRIMARY_PINK_1 } from "~ui/colors";
import { squareStyle } from "~ui/styleHelpers";
import { hoverTransition } from "~ui/transitions";

type ButtonSize = "small" | "medium" | "large";
type ButtonKind = "secondary" | "transparent";

interface Props {
  icon: ReactNode;
  size?: ButtonSize;
  kind?: ButtonKind;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
}

export const CircleIconButton = styled(function CircleIconButton({
  icon,
  size = "small",
  kind = "secondary",
  onClick,
  className,
  tooltip,
}: Props) {
  return (
    <UIButton data-tooltip={tooltip} className={className} onClick={onClick} size={size} kind={kind}>
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
    &:hover {
      background: ${BASE_GREY_4};
    }
    &:active {
      background: ${CLOUD_LIGHTER};
      border-color: ${PRIMARY_PINK_1};
    }
  `,
  transparent: css`
    background: transparent;
    &:hover {
      background: ${BASE_GREY_6};
    }
    &:active {
      background: ${BASE_GREY_6};
    }
  `,
};

export const UIButton = styled.button<{ size: ButtonSize; kind: ButtonKind }>`
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  ${borderRadius.circle};
  font-size: 16px;
  color: ${DARK_ONYX};
  padding: 0;

  ${hoverTransition()}

  ${({ size }) => buttonSizeSpecificStyle[size]}
  ${({ kind }) => buttonKindSpecificStyle[kind]}
`;
