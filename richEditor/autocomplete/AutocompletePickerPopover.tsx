import { Popover } from "~ui/popovers/Popover";
import { NodeViewWrapper } from "@tiptap/react";
import { SuggestionProps } from "@tiptap/suggestion";
import { ComponentType } from "react";
import { AutocompletePickerProps } from "./component";
import { useValueRef } from "~shared/hooks/useValueRef";
import { PopPresenceAnimator } from "~ui/animations";

interface Props<D> {
  baseProps: SuggestionProps;
  PickerComponent: ComponentType<AutocompletePickerProps<D>>;
}

export function AutocompletePickerPopoverBase<D>({ baseProps, PickerComponent }: Props<D>) {
  const anchorRef = useValueRef(baseProps.decorationNode as HTMLElement);
  return (
    <NodeViewWrapper className="picker">
      <Popover anchorRef={anchorRef} placement="top-start">
        <PopPresenceAnimator>
          <PickerComponent
            keyword={baseProps.query}
            onSelect={(item) => {
              baseProps.command(item);
            }}
          />
        </PopPresenceAnimator>
      </Popover>
    </NodeViewWrapper>
  );
}
