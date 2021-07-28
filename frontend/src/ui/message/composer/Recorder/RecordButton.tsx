import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";
import { BACKGROUND_ACCENT_WEAK } from "~ui/theme/colors/base";
import { getButtonColorStyles } from "~ui/transitions";
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
  font-size: 1.5rem;
  width: 1.75em;
  height: 1.75em;

  ${getButtonColorStyles(BACKGROUND_ACCENT_WEAK)}
  ${borderRadius.circle}
  cursor: pointer;
`;
