import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { IconCheckCircle } from "~ui/icons";
import { ACTION_ACTIVE_COLOR } from "~ui/transitions";
import { OptionLabel } from "./OptionLabel";

interface Props {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  onHighlightRequest?: () => void;
  onStopHighlightRequest?: () => void;
  isHighlighted?: boolean;
  isSelected?: boolean;
}

export function DropdownItem({
  label,
  icon,
  onClick,
  isHighlighted = false,
  isSelected = false,
  onHighlightRequest,
  onStopHighlightRequest,
}: Props) {
  return (
    <UIOption
      isHighlighted={isHighlighted}
      onMouseEnter={onHighlightRequest}
      onMouseLeave={onStopHighlightRequest}
      onClick={onClick}
      onMouseMove={() => {
        if (isHighlighted) return;

        onHighlightRequest?.();
      }}
    >
      <OptionLabel icon={icon} label={label} />
      {isSelected && <IconCheckCircle />}
    </UIOption>
  );
}

const UIOption = styled.div<{ isHighlighted: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 42px;
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    font-size: 24px;
  }

  ${OptionLabel} {
    flex-grow: 1;
  }

  &:hover {
    background-color: ${ACTION_ACTIVE_COLOR};
  }

  ${(props) =>
    props.isHighlighted &&
    css`
      background-color: ${ACTION_ACTIVE_COLOR};
    `}
`;
