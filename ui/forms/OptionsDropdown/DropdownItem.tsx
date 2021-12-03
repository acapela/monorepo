import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { styledForwardRef } from "~shared/component";
import { handleWithStopPropagation } from "~shared/events";
import { IconCheck } from "~ui/icons";
import { theme } from "~ui/theme";

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

export const DropdownItem = styledForwardRef<HTMLDivElement, Props>(function DropdownItem(
  {
    label,
    icon,
    onClick,
    isHighlighted = false,
    isSelected = false,
    onHighlightRequest,
    onStopHighlightRequest,
    className,
  }: Props,
  ref
) {
  return (
    <UIOption
      ref={ref}
      role="option"
      className={className}
      isHighlighted={isHighlighted}
      onMouseEnter={onHighlightRequest}
      onMouseLeave={onStopHighlightRequest}
      onClick={handleWithStopPropagation(onClick)}
      onMouseMove={() => {
        if (isHighlighted) return;

        onHighlightRequest?.();
      }}
    >
      <OptionLabel icon={icon} label={label} />
      {isSelected && <IconCheck />}
    </UIOption>
  );
})``;

const background = theme.colors.panels.popover;

const UIOption = styled.div<{ isHighlighted: boolean }>`
  ${theme.box.selectOption};

  display: flex;
  align-items: center;

  display: flex;
  align-items: center;
  cursor: pointer;

  ${theme.transitions.hover()};
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
    props.isHighlighted &&
    css`
      ${background.active.asBg};
    `}
`;
