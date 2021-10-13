import { ReactNode } from "react";
import styled from "styled-components";

import { namedForwardRef } from "~shared/react/namedForwardRef";
import { theme } from "~ui/theme";

interface Props {
  icon: ReactNode;
  onClick?: () => void;
  tooltip?: string;
}

export const WideIconButton = namedForwardRef<HTMLButtonElement, Props>(function WideIconButton(
  { icon, onClick, tooltip }: Props,
  ref
) {
  return (
    <UIButton ref={ref} data-tooltip={tooltip} onClick={onClick}>
      {icon}
    </UIButton>
  );
});

export const UIButton = styled.button`
  width: 40px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  ${theme.radius.button}
  ${theme.transitions.hover()}
`;
