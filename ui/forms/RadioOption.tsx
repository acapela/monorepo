import React, { ChangeEvent } from "react";
import styled from "styled-components";

import { theme } from "~ui/theme";

interface Props {
  name: string;
  value: string | number;
  children: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

const UIContainer = styled.label<{ selected: boolean }>`
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  ${theme.colors.layout.background.interactive};
  ${theme.transitions.hover()};

  ${({ selected }) => selected && theme.colors.layout.background.active.asBg}

  input[type=radio] {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
`;

export const RadioOption = ({ value, children, selected, onSelect, name }: Props) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === value) {
      onSelect();
    }
  };

  return (
    <UIContainer onFocus={onSelect} onClick={onSelect} selected={selected}>
      <input type="radio" name={name} checked={selected} value={value} onChange={handleChange} />
      {children}
    </UIContainer>
  );
};
