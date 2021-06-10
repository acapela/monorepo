import styled from "styled-components";
import { hoverActionCss } from "../transitions";
import { ReactNode } from "react";

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

  width: 1em;
  height: 1em;

  border-radius: 0.25em;
  background-color: transparent;
  border: none;
  cursor: pointer;

  font-size: 1.5rem;

  ${hoverActionCss};

  svg {
    font-size: 1em;
  }
`;

const UIIconHolder = styled.div``;
