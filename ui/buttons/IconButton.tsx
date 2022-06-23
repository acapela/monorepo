import React, { ReactNode } from "react";
import styled from "styled-components";

import { styledForwardRef } from "@aca/shared/component";
import { handleWithStopPropagationAndPreventDefault } from "@aca/shared/events";
import { theme } from "@aca/ui/theme";

import { disabledCss } from "../disabled";
import { ShortcutDefinition } from "../keyboard/shortcutBase";
import { getTooltipProps } from "../popovers/tooltipProps";
import { ButtonKind, ButtonSize, getButtonKindStyles, getButtonSizeStyles } from "./variants";

export interface IconButtonProps {
  icon: ReactNode;
  kind?: ButtonKind;
  size?: ButtonSize;
  onClick?: () => void;
  className?: string;
  title?: string;
  tooltip?: string;
  shortcut?: ShortcutDefinition;
  isDisabled?: boolean;
  isCircular?: boolean;
  iconScaleFactor?: number;
  indicateNotification?: boolean;
}

export const IconButton = styledForwardRef<HTMLButtonElement, IconButtonProps>(function CircleIconButton(
  {
    icon,
    kind = "transparent",
    size = "regular",
    onClick,
    shortcut,
    className,
    tooltip,
    isDisabled = false,
    iconScaleFactor = 1,
    indicateNotification,
    ...props
  }: IconButtonProps,
  ref
) {
  return (
    <UIButton
      ref={ref}
      {...getTooltipProps({ label: tooltip, shortcut })}
      className={className}
      onClick={onClick ? handleWithStopPropagationAndPreventDefault(onClick) : onClick}
      $kind={kind}
      $size={size}
      $isDisabled={isDisabled}
      disabled={isDisabled}
      iconScaleFactor={iconScaleFactor}
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
  ${theme.colors.primary.asBg};
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
  iconScaleFactor: number;
}>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  outline: none;

  ${theme.radius.button};

  ${theme.transitions.hover()};
  ${(props) => getButtonKindStyles(props.$kind)}
  ${(props) => getButtonSizeStyles(props.$size).square}

  svg {
    ${theme.iconSize.itemLarge};
    transform: scale(${(props) => props.iconScaleFactor});
  }

  ${(props) => props.$isDisabled && disabledCss}

  ${(props) => !props.$isDisabled && theme.common.clickable};
`;
