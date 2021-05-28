import { ButtonHTMLAttributes, useRef } from "react";
import styled from "styled-components";
import { Tooltip } from "~ui/popovers/Tooltip";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  tooltipLabel?: string;
}

export const RecordButton = styled(function RecordButton({ tooltipLabel, ...otherProps }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <UIButton {...otherProps} ref={ref} />
      {tooltipLabel && <Tooltip anchorRef={ref} label={tooltipLabel} />}
    </>
  );
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
  border-radius: 50%;
  padding: 0;
  cursor: pointer;

  :disabled {
    cursor: default;

    svg {
      fill: #a7a3a3;
    }
  }
`;
