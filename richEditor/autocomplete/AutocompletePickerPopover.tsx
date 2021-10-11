import { NodeViewWrapper } from "@tiptap/react";
import { SuggestionProps } from "@tiptap/suggestion";
import { ComponentType, useState } from "react";

import { useComparingEffect } from "~shared/hooks/useComparingEffect";
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
  const [isHidden, setIsHidden] = useState(false);

  useComparingEffect((queryNow, queryBefore) => {
    if (!isHidden) {
      return;
    }

    // We're just erasing the content with backspace, keep hidden.
    if (queryBefore.startsWith(queryNow)) {
      return;
    }

    // We started typing something new, re-show the popover.
    setIsHidden(false);
  }, baseProps.query);

  useShortcut("Escape", () => {
    setIsHidden(true);
  });

  return (
    <NodeViewWrapper className="picker">
      {!isHidden && (
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
