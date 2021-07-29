import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";
import { theme } from "~ui/theme";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  tooltipLabel?: string;
}

// TODO: Move to Circle Button
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

  ${theme.borderRadius.circle}
  ${theme.colors.actions.tertiary.all()}

  cursor: pointer;
`;
