import { Editor } from "@tiptap/core";
import { NodeViewProps } from "@tiptap/react";

export interface AutocompleteNodeProps<D> {
  data: D;
  isEditable: boolean;
  node: NodeViewProps["node"];
  update: (attributesToUpdate: Partial<D>) => void;
  editor: Editor;
}

export interface AutocompletePickerProps<D> {
  keyword: string;
  onSelect: (item: D) => void;
}
