import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { styledForwardRef } from "@aca/shared/component";
import { theme } from "@aca/ui/theme";

import { ButtonKind, getButtonKindtyles } from "./variants";

export interface IconButtonProps {
  icon: ReactNode;
  kind?: ButtonKind;
  onClick?: () => void;
  className?: string;
  title?: string;
  tooltip?: string;
  isDisabled?: boolean;
  iconSizeRatio?: number;
}

/**
 * By default icon occupy 0.75 of circle size. It might 'look' good for various icons or use cases to modify this ratio.
 * eg. 0.5 means if circle has 32px size, icon will have 16px size.
 */
const DEFAULT_ICON_SIZE_RATIO = 1;

export const IconButton = styledForwardRef<HTMLButtonElement, IconButtonProps>(function CircleIconButton(
  {
    icon,
    kind = "transparent",
    onClick,
    className,
    tooltip,
    isDisabled = false,
    iconSizeRatio = DEFAULT_ICON_SIZE_RATIO,
    ...props
  }: IconButtonProps,
  ref
) {
  return (
    <UIButton
      ref={ref}
      data-tooltip={tooltip}
      className={className}
      onClick={onClick}
      kind={kind}
      $isDisabled={isDisabled}
      disabled={isDisabled}
      iconSizeRatio={iconSizeRatio}
      {...props}
    >
      {icon}
    </UIButton>
  );
})``;

const ICON_SIZE = 20;

export const UIButton = styled.button<{
  kind: ButtonKind;
  $isDisabled: boolean;
  iconSizeRatio: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${ICON_SIZE}px;
  aspect-ratio: 1;
  padding: 6px;

  ${theme.radius.button};
  ${theme.transitions.hover()};

  ${(props) => getButtonKindtyles(props.kind)}

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
