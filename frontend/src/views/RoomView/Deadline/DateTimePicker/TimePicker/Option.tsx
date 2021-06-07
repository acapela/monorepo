import React, { useCallback } from "react";
import styled, { css } from "styled-components";

interface Props {
  name: string;
  value: string | number;
  children: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

const Container = styled.label<{ selected: boolean }>`
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ selected }) =>
    selected &&
    css`
      background: #f4f4f4;
    `}

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
  :hover {
    background: #f4f4f4;
  }
`;

export const Option = ({ value, children, selected, onSelect, name }: Props) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value === value) {
        onSelect();
      }
    },
    [onSelect, value]
  );

  return (
    <Container onFocus={onSelect} selected={selected}>
      <input type="radio" name={name} checked={selected} value={value} onChange={handleChange} />
      {children}
    </Container>
  );
};
