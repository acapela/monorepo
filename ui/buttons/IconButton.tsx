import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { styledForwardRef } from "@aca/shared/component";
import { handleWithStopPropagationAndPreventDefault } from "@aca/shared/events";
import { theme } from "@aca/ui/theme";

import { ButtonKind, ButtonSize, getButtonKindtyles, getButtonSizeStyles } from "./variants";

export interface IconButtonProps {
  icon: ReactNode;
  kind?: ButtonKind;
  size?: ButtonSize;
  onClick?: () => void;
  className?: string;
  title?: string;
  tooltip?: string;
  isDisabled?: boolean;
  iconSizeRatio?: number;
  indicateNotification?: boolean;
}

/**
 * By default icon occupy 0.75 of circle size. It might 'look' good for various icons or use cases to modify this ratio.
 * eg. 0.5 means if circle has 32px size, icon will have 16px size.
 */
const DEFAULT_ICON_SIZE_RATIO = 1.45;

export const IconButton = styledForwardRef<HTMLButtonElement, IconButtonProps>(function CircleIconButton(
  {
    icon,
    kind = "transparent",
    size = "regular",
    onClick,
    className,
    tooltip,
    isDisabled = false,
    iconSizeRatio = DEFAULT_ICON_SIZE_RATIO,
    indicateNotification,
    ...props
  }: IconButtonProps,
  ref
) {
  return (
    <UIButton
      ref={ref}
      data-tooltip={tooltip}
      className={className}
      onClick={onClick ? handleWithStopPropagationAndPreventDefault(onClick) : onClick}
      $kind={kind}
      $size={size}
      $isDisabled={isDisabled}
      disabled={isDisabled}
      iconSizeRatio={iconSizeRatio}
      {...props}
    >
      {icon}
      {indicateNotification && <UIIndicator />}
    </UIButton>
  );
})``;

const INDICATOR_SIZE = 6;

const UIIndicator = styled.div`
  height: ${INDICATOR_SIZE}px;
  width: ${INDICATOR_SIZE}px;
  background-color: #e3224f;
  border-radius: 10px;
  position: absolute;
  top: 0;
  right: 0;
  margin-top: -${INDICATOR_SIZE / 2}px;
  margin-left: -${INDICATOR_SIZE / 2}px;
`;

export const UIButton = styled.button<{
  $kind: ButtonKind;
  $size: ButtonSize;
  $isDisabled: boolean;
  iconSizeRatio: number;
}>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  outline: none;

  ${theme.radius.button};
  ${theme.transitions.hover()};

  ${(props) => getButtonKindtyles(props.$kind)}
  ${(props) => getButtonSizeStyles(props.$size).square}

  svg {
    font-size: ${(props) => props.iconSizeRatio}em;
  }

  ${(props) =>
    props.$isDisabled &&
    css`
      opacity: 0.25;
      pointer-events: none;
    `}

  ${(props) => !props.$isDisabled && theme.common.clickable};
`;
