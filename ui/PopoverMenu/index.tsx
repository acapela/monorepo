import React, { RefObject, useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { zIndex } from "~ui/zIndex";

import { Placement } from "@popperjs/core";

interface PopoverMenuProps {
  //   handlerRef: HTMLElement | null;
  children: React.ReactElement; // Only one child accepted
  options: Options[];
  position: PopoverPosition;
}

export interface Options {
  label: string;
  onSelect: () => void;
}

export const Position = {
  BOTTOM: "bottom" as const,
  BOTTOM_LEFT: "bottom-left" as const,
  BOTTOM_RIGHT: "bottom-right" as const,
  LEFT: "left" as const,
  LEFT_BOTTOM: "left-bottom" as const,
  LEFT_TOP: "left-top" as const,
  RIGHT: "right" as const,
  RIGHT_BOTTOM: "right-bottom" as const,
  RIGHT_TOP: "right-top" as const,
  TOP: "top" as const,
  TOP_LEFT: "top-left" as const,
  TOP_RIGHT: "top-right" as const,
};

export type Position = typeof Position[keyof typeof Position];

export const PopoverPosition = {
  ...Position,
  AUTO: "auto" as const,
  AUTO_END: "auto-end" as const,
  AUTO_START: "auto-start" as const,
};
export type PopoverPosition = typeof PopoverPosition[keyof typeof PopoverPosition];

const PureOptionsMenu = ({ children, options, position = PopoverPosition.AUTO }: PopoverMenuProps) => {
  // "Anchor" element for positioning the popover
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);

  const [popperElement, setPopperElement] = useState<HTMLElement | null>();

  const [isOpen, setOpen] = useState<boolean>(false);

  const wholeContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClickListener(wholeContainerRef, () => setOpen(false));

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: positionToPlacement(position),
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 15],
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

  const triggerElement = React.Children.toArray(children)[0];

  if (triggerElement === undefined || options.length == 0) {
    return null;
  }

  return (
    <div ref={wholeContainerRef}>
      <div ref={setReferenceElement} onClick={() => setOpen(!isOpen)}>
        {triggerElement}
      </div>

      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        {isOpen ? (
          <UIMenu>
            <ul>
              {options.map(({ label, onSelect }) => (
                <li
                  key={label}
                  onClick={() => {
                    onSelect();
                    setOpen(false);
                  }}
                >
                  {label}
                </li>
              ))}
            </ul>{" "}
          </UIMenu>
        ) : (
          false
        )}
      </div>
    </div>
  );
};

const UIMenu = styled.div`
  align-items: left;
  text-align: left;

  padding: 0.5rem;
  min-width: 204px;

  background: #ffffff;

  border: 1px solid #f8f8f8;
  box-shadow: 0px 1px 13px 3px rgba(0, 0, 0, 0.29);
  border-radius: 0.5rem;

  li {
    padding: 0 0.5rem 0 0.5rem;
    line-height: 3rem;

    color: #939eaa;
    border-radius: 0.25rem;
  }

  li:hover {
    background: #f4f6f8;
    color: #232b35;
  }
`;

export const PopoverMenu = styled(PureOptionsMenu)`
  z-index: ${zIndex.Popover};
`;

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideClickListener(ref: RefObject<HTMLDivElement>, onOutsideClick: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!event.target || !(ref && ref.current && ref.current.contains(event.target as Node))) {
        onOutsideClick();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

function positionToPlacement(position: PopoverPosition): Placement {
  switch (position) {
    case Position.TOP_LEFT:
      return "top-start";
    case Position.TOP:
      return "top";
    case Position.TOP_RIGHT:
      return "top-end";
    case Position.RIGHT_TOP:
      return "right-start";
    case Position.RIGHT:
      return "right";
    case Position.RIGHT_BOTTOM:
      return "right-end";
    case Position.BOTTOM_RIGHT:
      return "bottom-end";
    case Position.BOTTOM:
      return "bottom";
    case Position.BOTTOM_LEFT:
      return "bottom-start";
    case Position.LEFT_BOTTOM:
      return "left-end";
    case Position.LEFT:
      return "left";
    case Position.LEFT_TOP:
      return "left-start";
    case "auto":
    case "auto-start":
    case "auto-end":
      // Return the string unchanged.
      return position;
    default:
      throw new Error("invalid position");
  }
}
