import React from "react";
import styled from "styled-components";

import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { IconChevronDown } from "~ui/icons";

interface Props {
  isOpened: boolean;
  onToggle(isOpened: boolean): void;
  className?: string;
}

export const CollapseToggleButton = styled(function CollapseToggleButton({ isOpened, onToggle, className }: Props) {
  return (
    <UIToggleButton
      isOpened={isOpened}
      className={className}
      icon={<IconChevronDown />}
      onClick={() => onToggle(!isOpened)}
      kind="tertiary"
    />
  );
})``;

const UIToggleButton = styled(CircleIconButton)<{ isOpened: boolean }>`
  svg {
    transform: rotateZ(
      ${(props) => {
        return props.isOpened ? "180deg" : "0deg";
      }}
    );
    transition: 0.15s all;
  }
`;
