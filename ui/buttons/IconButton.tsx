import styled from "styled-components";
import { hoverActionCss } from "../transitions";
import { ReactNode } from "react";
import { borderRadius } from "~ui/baseStyles";

interface Props {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
}

export const IconButton = styled(function IconButton({ icon, onClick, className, tooltip }: Props) {
  return (
    <UIHolder data-tooltip={tooltip} onClick={onClick} className={className}>
      <UIIconHolder>{icon}</UIIconHolder>
    </UIHolder>
  );
})``;

const UIHolder = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 1.5em;
  height: 1.5em;

  ${borderRadius.button}
  background-color: transparent;
  border: none;
  cursor: pointer;

  color: inherit;

  font-size: 1.5rem;

  ${hoverActionCss};

  svg {
    font-size: 1em;
  }
`;

const UIIconHolder = styled.div``;
