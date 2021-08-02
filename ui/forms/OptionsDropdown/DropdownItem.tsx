import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { setColorOpacity } from "~shared/colors";
import { handleWithStopPropagation } from "~shared/events";
import { PRIMARY_PINK_1 } from "~ui/theme/colors/base";
import { IconCheck } from "~ui/icons";
import { OptionLabel } from "./OptionLabel";
import { theme } from "~ui/theme";

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

  border: 1px solid;

  transition: 0.15s all;
  ${theme.borderRadius.item};

  svg {
    font-size: 24px;
  }

  ${OptionLabel} {
    flex-grow: 1;
  }

  &:hover {
    background-color: ${setColorOpacity(PRIMARY_PINK_1, 0.05)};
  }

  svg {
    color: ${PRIMARY_PINK_1};
  }

  ${(props) =>
    props.isHighlighted &&
    css`
      border: 1px solid ${PRIMARY_PINK_1};
      background-color: ${setColorOpacity(PRIMARY_PINK_1, 0.05)};
    `}
`;
