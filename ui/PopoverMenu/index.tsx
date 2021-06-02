import React, { useRef, useState } from "react";
import { zIndex } from "~ui/zIndex";

import styled from "styled-components";
import { usePopper } from "react-popper";
import { useClickAway } from "react-use";
import { useBoolean } from "~frontend/src/hooks/useBoolean";

type NonEmpty<T> = [T, ...T[]];
interface Props {
  children: React.ReactElement; // Only one child accepted
  options: NonEmpty<PopoverMenuOptions>;
  position: PopoverPosition;

  // https://popper.js.org/docs/v2/modifiers/offset/
  skidding?: number;
  distance?: number;
}

export interface PopoverMenuOptions {
  label: string;
  onSelect: () => void;
}

// See https://atomiks.github.io/tippyjs/#placement
export const PopoverPosition = {
  // chooses the side with most space
  AUTO: "auto",
  AUTO_END: "auto-end",
  AUTO_START: "auto-start",

  BOTTOM: "bottom",
  BOTTOM_LEFT: "bottom-start",
  BOTTOM_RIGHT: "bottom-end",
  LEFT: "left",
  LEFT_TOP: "left-start",
  LEFT_BOTTOM: "left-end",
  RIGHT: "right",
  RIGHT_TOP: "right-start",
  RIGHT_BOTTOM: "right-end",
  TOP: "top",
  TOP_LEFT: "top-start",
  TOP_RIGHT: "top-end",
} as const;

export type PopoverPosition = typeof PopoverPosition[keyof typeof PopoverPosition];

const PureOptionsMenu = ({
  children: triggerElement,
  options,
  position = PopoverPosition.AUTO,
  skidding = 0,
  distance = 8,
}: Props) => {
  const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);

  const [popperElement, setPopperElement] = useState<HTMLElement | null>();

  const [isOpen, { unset: closePopover, toggle: togglePopover }] = useBoolean(false);

  const wholeContainerRef = useRef<HTMLDivElement>(null);
  useClickAway(wholeContainerRef, () => closePopover());

  const { styles, attributes } = usePopper(anchorElement, popperElement, {
    placement: position,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [skidding, distance],
        },
      },
      {
        name: "preventOverflow",
        options: {
          padding: 8,
        },
      },
    ],
  });

  return (
    <div ref={wholeContainerRef}>
      <div ref={setAnchorElement} onClick={() => togglePopover()}>
        {triggerElement}
      </div>

      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        {isOpen ? (
          <UIMenu>
            {options.map(({ label, onSelect }) => (
              <UIMenuItem
                key={label}
                onClick={() => {
                  onSelect();
                  closePopover();
                }}
              >
                {label}
              </UIMenuItem>
            ))}
          </UIMenu>
        ) : null}
      </div>
    </div>
  );
};

const UIMenu = styled.ul`
  align-items: left;
  text-align: left;

  padding: 0.5rem;
  min-width: 14rem;

  background: #fff;

  border: 1px solid #f8f8f8;
  box-shadow: 0px 1px 13px 3px rgba(0, 0, 0, 0.29);
  border-radius: 0.5rem;
`;

const UIMenuItem = styled.li`
  padding: 0 0.5rem;
  line-height: 3rem;
  cursor: pointer;

  color: #939eaa;
  border-radius: 0.25rem;

  :hover {
    background: #f4f6f8;
    color: #232b35;
  }
`;

export const PopoverMenu = styled(PureOptionsMenu)`
  z-index: ${zIndex.Popover};
`;
