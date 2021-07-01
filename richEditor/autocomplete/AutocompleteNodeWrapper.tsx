import { Popover } from "~ui/popovers/Popover";
import { NodeViewWrapper } from "@tiptap/react";
import { SuggestionProps } from "@tiptap/suggestion";
import { ComponentType, ReactNode } from "react";
import { AutocompleteNodeProps, AutocompletePickerProps } from "./component";
import { useValueRef } from "../../shared/hooks/useValueRef";

interface Props<D> {
  type: string;
  data: D;
  NodeComponent: ComponentType<AutocompleteNodeProps<D>>;
}

export function AutocompleteNodeWrapper<D>({ data, NodeComponent, type }: Props<D>) {
  return (
    <NodeViewWrapper className={`node-${type}`} as="span">
      <NodeComponent data={data} />
    </NodeViewWrapper>
  );
}
