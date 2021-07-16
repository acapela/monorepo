import { ReactNode } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import {
  CLOUD_LIGHTER,
  DARK_ONYX,
  BASE_GREY_4,
  BASE_GREY_6,
  PRIMARY_PINK_1,
  BUTTON_BACKGROUND_COLOR,
  WHITE,
  BUTTON_BACKGROUND_ACTIVE_COLOR,
} from "~ui/colors";
import { squareStyle } from "~ui/styleHelpers";
import { hoverTransition } from "~ui/transitions";

type ButtonSize = "small" | "large" | "inherit";
type ButtonKind = "secondary" | "transparent" | "primary";

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
    font-size: 24px;
  `,
  large: css`
    font-size: 36px;
  `,
  inherit: css`
    font-size: inherit;
  `,
};

const buttonKindSpecificStyle: Record<ButtonKind, FlattenSimpleInterpolation> = {
  primary: css`
    background: ${BUTTON_BACKGROUND_COLOR};
    color: ${WHITE};
    border: 1px solid transparent;
    &:hover {
      background: ${BUTTON_BACKGROUND_ACTIVE_COLOR};
    }
    &:active {
      background: ${BUTTON_BACKGROUND_ACTIVE_COLOR};
    }
  `,
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
  ${({ size }) => buttonSizeSpecificStyle[size]};
  color: ${DARK_ONYX};
  padding: 0;

  ${hoverTransition()}

  width: 1em;
  height: 1em;

  svg {
    font-size: 0.75em;
  }

  ${({ kind }) => buttonKindSpecificStyle[kind]}
`;
