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

export const UIButton = styled.button<{}>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  aspect-ratio: 1;

  ${theme.radius.button};
  ${theme.colors.action.secondary.interactive};

  ${theme.transitions.hover()};

  cursor: pointer;
`;
