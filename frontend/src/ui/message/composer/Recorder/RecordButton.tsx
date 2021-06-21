import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  tooltipLabel?: string;
}

export const RecordButton = styled(function RecordButton({ tooltipLabel, ...otherProps }: Props) {
  return <UIButton data-tooltip={tooltipLabel} {...otherProps} />;
})``;

export const UIButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
  background: #f8f8f8;
  color: #707f8c;
  ${borderRadius.circle}
  padding: 0;
  cursor: pointer;

  :disabled {
    cursor: default;

    svg {
      fill: #a7a3a3;
    }
  }
`;
