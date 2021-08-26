import { NodeViewProps } from "@tiptap/react";

export interface AutocompleteNodeProps<D> {
  data: D;
  isEditable: boolean;
  node: NodeViewProps["node"];
}

export interface AutocompletePickerProps<D> {
  keyword: string;
  onSelect: (item: D) => void;
}
