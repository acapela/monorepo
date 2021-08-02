import { Placement, VirtualElement } from "@popperjs/core";
import { throttle } from "lodash";
import React, { ReactNode, useEffect, useState } from "react";
import { usePopper } from "react-popper";
import styled, { css } from "styled-components";
import { createCleanupObject } from "~shared/cleanup";
import { createDocumentEvent } from "~shared/domEvents";
import { useResizeCallback } from "~shared/hooks/useResizeCallback";
import { useValueRef } from "~shared/hooks/useValueRef";
import { BodyPortal } from "~ui/BodyPortal";
import { zIndex } from "~ui/zIndex";

interface PopoverProps {
  children: ReactNode;
  isDisabled?: boolean;
  className?: string;
  placement?: Placement;
  ignoreMouseSelectionChange?: boolean;
}

export function createNullDomRect() {
  const nullDomRect: DOMRect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 0,
    width: 0,
    toJSON: () => {
      return JSON.stringify(nullDomRect);
    },
  };

  return nullDomRect;
}

const selectionVirtualElement: VirtualElement = {
  getBoundingClientRect(): DOMRect {
    if (typeof window === "undefined") return createNullDomRect();

    const selection = getSelection();

    if (!selection) return createNullDomRect();

    return selection.getRangeAt(0).getBoundingClientRect();
  },
};

/**
 * Popover that will follow user selection. Useful for cases like text-editors.
 */
export const SelectionPopover = styled<PopoverProps>(
  ({ className, children, placement = "auto", ignoreMouseSelectionChange }) => {
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
    const [enableTransitions, setEnableTransitions] = useState(false);

    const { styles, attributes, update } = usePopper(selectionVirtualElement, popperElement, {
      placement,
      strategy: "fixed",

      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 5],
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

    useEffect(() => {
      function updateAndEnableTransitions() {
        setEnableTransitions(true);
        update?.();
      }

      if (!ignoreMouseSelectionChange) {
        return createDocumentEvent("selectionchange", updateAndEnableTransitions);
      }

      const cleanup = createCleanupObject();

      let isMouseBasedSelectionChange = false;

      cleanup.enqueue(createDocumentEvent("mousedown", () => (isMouseBasedSelectionChange = true)));
      cleanup.enqueue(createDocumentEvent("mouseup", () => (isMouseBasedSelectionChange = false)));
      cleanup.enqueue(
        createDocumentEvent("selectionchange", () => {
          if (isMouseBasedSelectionChange) return;

          updateAndEnableTransitions();
        })
      );

      return cleanup.clean;
    }, [ignoreMouseSelectionChange]);

    const throttledUpdate = throttle(update ?? (() => null), 200);

    const poperRef = useValueRef(popperElement);

    useResizeCallback(poperRef, () => {
      throttledUpdate?.();
    });

    return (
      <BodyPortal>
        <UIHolder
          enableTransitions={enableTransitions}
          className={className}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {children}
        </UIHolder>
      </BodyPortal>
    );
  }
)``;

const UIHolder = styled.div<{ enableTransitions: boolean }>`
  position: fixed;
  position: relative;
  will-change: transform;
  z-index: ${zIndex.Popover};

  ${(props) =>
    props.enableTransitions &&
    css`
      transition: 0.2s transform;
    `}
`;
