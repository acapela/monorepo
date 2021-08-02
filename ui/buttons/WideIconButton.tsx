import { ReactNode } from "react";
import styled from "styled-components";
import { namedForwardRef } from "~shared/react/namedForwardRef";
import { theme } from "~ui/theme";
import { buttonKindSpecificStyle } from "./sharedStyles";
import { ButtonKind } from "./types";

interface Props {
  icon: ReactNode;
  kind?: ButtonKind;
  onClick?: () => void;
  tooltip?: string;
}

export const WideIconButton = namedForwardRef<HTMLButtonElement, Props>(function WideIconButton(
  { icon, kind = "primary", onClick, tooltip }: Props,
  ref
) {
  return (
    <UIButton ref={ref} data-tooltip={tooltip} onClick={onClick} kind={kind}>
      {icon}
    </UIButton>
  );
});

export const UIButton = styled.button<{ kind: ButtonKind }>`
  width: 40px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  ${theme.borderRadius.tag}
  ${theme.transitions.hover()}

  ${({ kind }) => buttonKindSpecificStyle[kind]}
`;
