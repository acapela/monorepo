import React, { CSSProperties, ReactNode, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { zIndex } from "~ui/zIndex";

interface PopoverProps {
  handlerRef: HTMLElement | null;
  children: ReactNode;
  className?: string;
  cornered?: boolean;
}

const PurePopover = ({ className, handlerRef, children, cornered = false }: PopoverProps) => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const { styles, attributes } = usePopper(handlerRef, popperElement, {
    placement: "top",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 5],
        },
      },
    ],
  });

  const popperStyles: CSSProperties = cornered ? { position: "fixed", left: "3rem", bottom: "2rem" } : styles.popper;

  return (
    <div className={className} ref={setPopperElement} style={popperStyles} {...attributes.popper}>
      {children}
    </div>
  );
};

export const Popover = styled(PurePopover)`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: ${zIndex.Popover};
`;
