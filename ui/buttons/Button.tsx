import { HTMLMotionProps, motion } from "framer-motion";
import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { styledForwardRef } from "~shared/component";
import { PopPresenceAnimator } from "~ui/animations";
import { disabledCss } from "~ui/disabled";
import { ShortcutDefinition } from "~ui/keyboard/shortcutBase";
import { useOptionalShortcut } from "~ui/keyboard/useShortcut";
import { getTooltipProps } from "~ui/popovers/tooltipProps";
import { theme } from "~ui/theme";

import { ButtonKind, getButtonKindtyles } from "./variants";

export interface ButtonDisabledInfo {
  reason: string;
}

export interface ButtonProps extends HTMLMotionProps<"button"> {
  icon?: ReactNode;
  iconAtStart?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean | ButtonDisabledInfo;
  isWide?: boolean;
  tooltip?: string;
  kind?: ButtonKind;
  shortcut?: ShortcutDefinition;
  onClick?: () => void;
}

export const PopAnimatedButton = (props: ButtonProps) => {
  return (
    <PopPresenceAnimator>
      <Button {...props} />
    </PopPresenceAnimator>
  );
};

export const Button = styledForwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    isLoading,
    isDisabled,
    isWide,
    icon,
    tooltip,
    iconAtStart = true,
    kind = "secondary",
    children,
    shortcut,
    onClick,
    ...htmlProps
  },
  ref
) {
  const iconNode = icon && <UIIconHolder>{icon}</UIIconHolder>;

  const isDisabledBoolean = !!isDisabled;

  function getTooltipLabel() {
    if (isDisabled && typeof isDisabled !== "boolean") {
      return isDisabled.reason;
    }

    return tooltip ?? null;
  }

  useOptionalShortcut(shortcut, () => {
    if (isDisabled) return;

    onClick?.();
    return true;
  });

  return (
    <UIButton
      ref={ref}
      $isLoading={isLoading}
      $isDisabled={isDisabledBoolean}
      disabled={isDisabledBoolean}
      $isWide={isWide}
      {...getTooltipProps({ label: getTooltipLabel(), shortcut })}
      $kind={kind}
      onClick={onClick}
      {...htmlProps}
    >
      {iconAtStart && iconNode}
      {children && <UIContentHolder>{children}</UIContentHolder>}
      {!iconAtStart && iconNode}
    </UIButton>
  );
})``;

const ICON_SIZE_TO_TEXT_RATIO = 1.5;

const UIIconHolder = styled.div<{}>`
  font-size: ${ICON_SIZE_TO_TEXT_RATIO}em;
  height: ${1 / ICON_SIZE_TO_TEXT_RATIO}em;
  display: flex;
  align-items: center;
`;

export const UIButton = styled(motion.button)<{
  $kind: ButtonKind;
  $isLoading?: boolean;
  $isDisabled?: boolean;
  $isWide?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  cursor: pointer;

  ${theme.typo.content.medium.resetLineHeight};
  ${theme.box.button};
  ${theme.radius.secondaryItem};
  ${theme.spacing.actions.asGap};

  a & {
    /* It is possible that button is inside <a> tag without having onClick handler. It means it should also have cursor pointer. */
    cursor: pointer;
  }

  ${theme.transitions.hover()}

  ${(props) => getButtonKindtyles(props.$kind)}

  ${(props) => (props.$isDisabled || props.$isLoading) && disabledCss};
  ${(props) =>
    props.$isWide &&
    css`
      width: 100%;
    `}
`;

const UIContentHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;
`;
