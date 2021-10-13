import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { setColorOpacity } from "~shared/colors";
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

export const DropdownItem = styled(function DropdownItem({
  label,
  icon,
  onClick,
  isHighlighted = false,
  isSelected = false,
  onHighlightRequest,
  onStopHighlightRequest,
  className,
}: Props) {
  return (
    <UIOption
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

const UIOption = styled.div<{ isHighlighted: boolean }>`
  padding: 0 16px;
  height: 42px;

  display: flex;
  align-items: center;

  display: flex;
  align-items: center;
  cursor: pointer;

  border: 1px solid transparent;

  transition: 0.15s all;
  ${theme.radius.secondaryItem};

  svg {
    font-size: 24px;
  }

  ${OptionLabel} {
    flex-grow: 1;
  }

  &:hover {
    ${theme.colors.primary.opacity(0.05).asBg};
  }

  svg {
    ${theme.colors.primary.asColor};
  }

  ${(props) =>
    props.isHighlighted &&
    css`
      border: 1px solid ${theme.colors.primary};
      ${theme.colors.primary.opacity(0.05).asBg};
    `}
`;
