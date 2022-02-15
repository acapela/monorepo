import React, { ReactNode, useRef } from "react";
import styled, { css } from "styled-components";

import { styledForwardRef } from "@aca/shared/component";
import { handleWithStopPropagation } from "@aca/shared/events";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";
import { useSharedRef } from "@aca/shared/hooks/useSharedRef";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { IconCheck } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { OptionLabel } from "./OptionLabel";

interface Props {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  onHighlightRequest?: () => void;
  onStopHighlightRequest?: () => void;
  isHighlighted?: boolean;
  isSelected?: boolean;
  className?: string;
}

export const DropdownItem = styled<Props>(function DropdownItem({
  label,
  icon,
  onClick,
  isHighlighted = false,
  isSelected = false,
  onHighlightRequest,
  onStopHighlightRequest,
  className,
}: Props) {
  const innerRef = useRef<HTMLDivElement>(null);

  useDependencyChangeEffect(() => {
    if (isHighlighted) {
      makeElementVisible(innerRef.current);
    }
  }, [isHighlighted]);

  useUserFocusedOnElement(
    innerRef,
    () => {
      onHighlightRequest?.();
    },
    () => {
      onStopHighlightRequest?.();
    }
  );

  return (
    <UIOption
      ref={innerRef}
      role="option"
      className={className}
      $isHighlighted={isHighlighted}
      onClick={handleWithStopPropagation(onClick)}
      onClickCapture={console.log}
    >
      <OptionLabel icon={icon} label={label} />
      {isSelected && <IconCheck />}
    </UIOption>
  );
})``;

const background = theme.colors.panels.popover;

const UIOption = styled.div<{ $isHighlighted: boolean }>`
  ${theme.box.selectOption};

  display: flex;
  align-items: center;
  ${theme.common.clickable};

  ${background.interactive};
  ${theme.spacing.actions.asGap};

  svg {
    font-size: 1.25em;
  }

  ${OptionLabel} {
    flex-grow: 1;
  }

  svg {
    ${theme.colors.primary.asColor};
  }

  ${(props) =>
    props.$isHighlighted &&
    css`
      ${background.active.asBg};
    `}
`;
