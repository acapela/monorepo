import { NodeViewWrapper } from "@tiptap/react";
import { SuggestionProps } from "@tiptap/suggestion";
import { ComponentType, useRef, useState } from "react";

import { useAsyncEffect } from "~shared/hooks/useAsyncEffect";
import { useComparingEffect } from "~shared/hooks/useComparingEffect";
import { useResizeCallback } from "~shared/hooks/useResizeCallback";
import { useValueRef } from "~shared/hooks/useValueRef";
import { PopPresenceAnimator } from "~ui/animations";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover } from "~ui/popovers/Popover";

import { AutocompletePickerProps } from "./component";
import { waitForElementPossitionToSettle } from "./utils";

interface Props<D> {
  baseProps: SuggestionProps;
  PickerComponent: ComponentType<AutocompletePickerProps<D>>;
}

export function AutocompletePickerPopoverBase<D>({ baseProps, PickerComponent }: Props<D>) {
  const anchorRef = useValueRef(baseProps.decorationNode as HTMLElement);
  const editorElement = baseProps.editor.view.dom as HTMLElement;
  const editorRef = useRef<HTMLElement>(editorElement);
  const [isCancelled, setIsCancelled] = useState(false);

  const [isPositionSettled, setIsPositionSettled] = useState(true);

  // If the editor resizes at any point, close all popovers until resize is done
  // This prevents the popover to be left floating on the wrong place
  useResizeCallback(editorRef, async () => {
    setIsPositionSettled(false);
  });

  useAsyncEffect(
    async (isCancelled) => {
      if (isPositionSettled) return;

      const [settlePromise, cancelWaiting] = waitForElementPossitionToSettle(editorElement);

      settlePromise.then(() => {
        if (isCancelled()) return;

        setIsPositionSettled(true);
      });

      return () => {
        cancelWaiting();
      };
    },
    [isPositionSettled, editorElement]
  );

  useComparingEffect((queryNow, queryBefore) => {
    if (!isCancelled) {
      return;
    }

    // We're just erasing the content with backspace, keep hidden.
    if (queryBefore.startsWith(queryNow)) {
      return;
    }

    // We started typing something new, re-show the popover.
    setIsCancelled(false);
  }, baseProps.query);

  useShortcut("Escape", () => {
    setIsCancelled(true);
  });

  const canShow = !isCancelled && isPositionSettled;

  return (
    <NodeViewWrapper className="picker">
      {canShow && (
        <Popover anchorRef={anchorRef} placement="top-start">
          <PopPresenceAnimator>
            <PickerComponent
              {...baseProps}
              keyword={baseProps.query}
              onSelect={(item) => {
                baseProps.command(item);
              }}
            />
          </PopPresenceAnimator>
        </Popover>
      )}
    </NodeViewWrapper>
  );
}
