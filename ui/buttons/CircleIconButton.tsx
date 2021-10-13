import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { theme } from "~ui/theme";

import { ButtonKind, getButtonKindtyles } from "./variants";

export interface Props {
  icon: ReactNode;
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
      kind={kind}
      isDisabled={isDisabled}
      disabled={isDisabled}
      iconSizeRatio={iconSizeRatio}
    >
      {icon}
    </UIButton>
  );
})``;

export const UIButton = styled.button<{
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
  ${(props) => getButtonKindtyles(props.kind)}

  ${theme.radius.circle};
  ${theme.transitions.hover()}

  svg {
    font-size: ${(props) => props.iconSizeRatio}em;
  }

  ${(props) =>
    !props.isDisabled &&
    css`
      cursor: pointer;
    `};
`;
