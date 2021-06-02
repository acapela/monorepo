import styled from "styled-components";
import { Button } from "./Button";
import { hoverActionCss } from "../transitions";
import { ReactNode, useRef } from "react";
import { Tooltip } from "~ui/popovers/Tooltip";

interface Props {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
}

export const IconButton = styled(function IconButton({ icon, onClick, className, tooltip }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  return (
    <>
      {tooltip && <Tooltip anchorRef={holderRef} label={tooltip} />}
      <UIHolder ref={holderRef} onClick={onClick} className={className}>
        <UIIconHolder>{icon}</UIIconHolder>
      </UIHolder>
    </>
  );
})``;

const UIHolder = styled.button`
  font-size: 24px;
  width: 1em;
  height: 1em;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25em;
  background-color: transparent;
  border: none;
  cursor: pointer;

  ${hoverActionCss};

  svg {
    font-size: 1em;
  }
`;

const UIIconHolder = styled.div``;
