import { HTMLMotionProps, motion } from "framer-motion";
import React, { MouseEvent, ReactNode, useState } from "react";
import styled, { css } from "styled-components";

import { styledForwardRef } from "@aca/shared/component";
import { MaybePromise } from "@aca/shared/promises";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { disabledCss } from "@aca/ui/disabled";
import { IconChevronDown } from "@aca/ui/icons";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";
import { useOptionalShortcut } from "@aca/ui/keyboard/useShortcut";
import { getTooltipProps } from "@aca/ui/popovers/tooltipProps";
import { UISpinner } from "@aca/ui/Spinner";
import { theme } from "@aca/ui/theme";

import { ButtonKind, ButtonSize, getButtonKindStyles, getButtonSizeStyles } from "./variants";

export interface ButtonDisabledInfo {
  reason: string;
}

export interface ButtonStyleProps {
  isWide?: boolean;
  kind?: ButtonKind;
  size?: ButtonSize;
}

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "disabled">, ButtonStyleProps {
  icon?: ReactNode;
  iconAtStart?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean | ButtonDisabledInfo;
  disableClicks?: boolean;
  tooltip?: string;
  shortcut?: ShortcutDefinition;
  indicateDropdown?: boolean;
  onClick?: (event?: MouseEvent) => MaybePromise<unknown>;
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
    size = "regular",
    children,
    shortcut,
    onClick,
    indicateDropdown,
    disableClicks,
    ...htmlProps
  },
  ref
) {
  const [isInProgress, setIsInProgress] = useState(false);
  const iconNode = icon && <UIIconHolder>{icon}</UIIconHolder>;

  const isDisabledBoolean = !!isDisabled;

  function getTooltipLabel() {
    if (isDisabled && typeof isDisabled !== "boolean") {
      return isDisabled.reason;
    }

    return tooltip ?? null;
  }

  async function handleTrigger(event?: MouseEvent) {
    if (isDisabled) return;

    const clickResult = onClick?.(event);

    if (!clickResult) return;

    try {
      setIsInProgress(true);
      await clickResult;
    } finally {
      setIsInProgress(false);
    }
  }

  useOptionalShortcut(shortcut, () => {
    if (isDisabled) return;

    handleTrigger();
    return true;
  });

  const showAsLoading = isLoading || isInProgress;

  return (
    <UIButton
      ref={ref}
      $isLoading={showAsLoading}
      $isDisabled={isDisabledBoolean}
      $disableClicks={disableClicks}
      disabled={isDisabledBoolean}
      $isWide={isWide}
      {...getTooltipProps({ label: getTooltipLabel(), shortcut })}
      $kind={kind}
      $size={size}
      onClick={handleTrigger}
      {...htmlProps}
    >
      {iconAtStart && iconNode}
      {children && <UIContentHolder>{children}</UIContentHolder>}
      {!iconAtStart && iconNode}
      {indicateDropdown && (
        <UIIconHolder>
          <IconChevronDown />
        </UIIconHolder>
      )}
      {showAsLoading && <UISpinner $thick />}
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

export const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  cursor: var(--pointer);

  ${theme.typo.content.medium.resetLineHeight};
  ${theme.radius.secondaryItem};
  ${theme.spacing.actions.asGap};

  a & {
    /* It is possible that button is inside <a> tag without having onClick handler. It means it should also have cursor pointer. */
    cursor: var(--pointer);
  }

  ${theme.transitions.hover()}
`;

export const UIButton = styled(motion.button)<{
  $kind: ButtonKind;
  $size: ButtonSize;
  $isLoading?: boolean;
  $isDisabled?: boolean;
  $isWide?: boolean;
  $disableClicks?: boolean;
}>`
  ${baseButtonStyles};

  ${(props) => getButtonKindStyles(props.$kind)};
  ${(props) => getButtonSizeStyles(props.$size)};

  ${theme.common.clickable};

  ${(props) =>
    props.$disableClicks &&
    css`
      pointer-events: none;
    `}

  ${(props) =>
    (props.$isDisabled || props.$isLoading) &&
    css`
      pointer-events: none;
    `};

  ${(props) => props.$isDisabled && disabledCss}
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
