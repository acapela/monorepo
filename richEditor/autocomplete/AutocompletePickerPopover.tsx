import { NodeViewWrapper } from "@tiptap/react";
import { SuggestionProps } from "@tiptap/suggestion";
import { ComponentType, useRef, useState } from "react";

import { useBoolean } from "~shared/hooks/useBoolean";
import { useComparingEffect } from "~shared/hooks/useComparingEffect";
import { useResizeCallback } from "~shared/hooks/useResizeCallback";
import { useValueRef } from "~shared/hooks/useValueRef";
import { PopPresenceAnimator } from "~ui/animations";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { Popover } from "~ui/popovers/Popover";

import { AutocompletePickerProps } from "./component";

interface Props<D> {
  baseProps: SuggestionProps;
  PickerComponent: ComponentType<AutocompletePickerProps<D>>;
}

export function AutocompletePickerPopoverBase<D>({ baseProps, PickerComponent }: Props<D>) {
  const anchorRef = useValueRef(baseProps.decorationNode as HTMLElement);
  const editorRef = useRef<HTMLElement>(baseProps.editor.view.dom as HTMLElement);

  const [isOpen, { set: open, unset: hide }] = useBoolean(true);
  const [popoverDelayedOpenTimerRef, setPopoverDelayedOpenTimerRef] = useState<null | number>(null);

  // If the editor resizes at any point, close all popovers until resize is done
  // This prevents the popover to be left floating on the wrong place
  useResizeCallback(editorRef, () => {
    // Cancels any open timers. Happens if resize is still not done
    if (popoverDelayedOpenTimerRef) {
      clearTimeout(popoverDelayedOpenTimerRef);
    }

    hide();

    // Wait 100ms until we can check if the resize is done
    const timeoutCancel = window.setTimeout(() => open(), 100);
    setPopoverDelayedOpenTimerRef(timeoutCancel);
  });

  useComparingEffect((queryNow, queryBefore) => {
    if (isOpen) {
      return;
    }

    // We're just erasing the content with backspace, keep hidden.
    if (queryBefore.startsWith(queryNow)) {
      return;
    }

    // We started typing something new, re-show the popover.
    open();
  }, baseProps.query);

  useShortcut("Escape", () => {
    hide();
  });

  return (
    <NodeViewWrapper className="picker">
      {isOpen && (
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
