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
import { hoverTransition } from "~ui/transitions";
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
  kind = "secondary",
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
      iconSizeRatio={iconSizeRatio}
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

export const UIButton = styled.button<{
  size: ButtonSize;
  kind: ButtonKind;
  isDisabled: boolean;
  iconSizeRatio: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${borderRadius.circle};
  ${({ size }) => buttonSizeSpecificStyle[size]};
  color: ${DARK_ONYX};
  padding: 0;

  ${hoverTransition()}

  width: 1em;
  height: 1em;

  svg {
    font-size: ${(props) => props.iconSizeRatio}em;
  }

  ${({ kind }) => buttonKindSpecificStyle[kind]}

  ${(props) =>
    !props.isDisabled &&
    css`
      cursor: pointer;
      ${hoverTransition()}
      ${buttonKindSpecificInteractionStyle[props.kind]}
    `};
`;
