import { ReactNode } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { CLOUD_LIGHTER, DARK_ONYX, BASE_GREY_4, PRIMARY_PINK_1 } from "~ui/colors";
import { squareStyle } from "~ui/styleHelpers";
import { hoverTransition } from "~ui/transitions";

type ButtonSize = "small" | "large";

interface Props {
  icon: ReactNode;
  size?: ButtonSize;
  onClick: () => void;
}

export const CircleIconButton = ({ icon, size = "small", onClick }: Props) => {
  return (
    <UIButton onClick={onClick} size={size}>
      {icon}
    </UIButton>
  );
};

const buttonSizeSpecificStyle: Record<ButtonSize, FlattenSimpleInterpolation> = {
  small: css`
    ${squareStyle(24)}
  `,
  large: css`
    ${squareStyle(36)}
  `,
};

export const UIButton = styled.button<{ size: ButtonSize }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${borderRadius.circle};

  ${hoverTransition()}

  font-size: 16px;

  ${({ size }) => buttonSizeSpecificStyle[size]}

  background: ${CLOUD_LIGHTER};
  color: ${DARK_ONYX};
  border: 1px solid transparent;
  &:hover {
    background: ${BASE_GREY_4};
  }
  &:active {
    background: ${CLOUD_LIGHTER};
    border-color: ${PRIMARY_PINK_1};
  }
`;
