import React from "react";
import styled from "styled-components";

import { IconButton } from "~ui/buttons/IconButton";
import { IconChevronDown } from "~ui/icons";

interface Props {
  isOpen: boolean;
  onToggle(isOpen: boolean): void;
  className?: string;
}

export const CollapseToggleButton = styled(function CollapseToggleButton({ isOpen, onToggle, className }: Props) {
  return (
    <UIToggleButton
      isOpen={isOpen}
      className={className}
      icon={<IconChevronDown />}
      onClick={() => onToggle(!isOpen)}
      kind="secondary"
    />
  );
})``;

const UIToggleButton = styled(IconButton)<{ isOpen: boolean }>`
  svg {
    transform: rotateZ(
      ${(props) => {
        return props.isOpen ? "0deg" : "-90deg";
      }}
    );
    transition: 0.15s linear all;
  }
`;
