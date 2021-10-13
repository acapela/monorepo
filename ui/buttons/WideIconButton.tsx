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
  ${theme.box.squareButton};
  ${theme.colors.layout.background.withBorder.interactive}

  svg {
    font-size: 1.5em;
  }

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  ${theme.radius.button}
  ${theme.transitions.hover()}
`;
