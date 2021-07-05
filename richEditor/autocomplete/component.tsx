import { JSONContent } from "@tiptap/react";

export interface AutocompleteNodeProps<D> {
  node: JSONContent;
  data: D;
}

export interface AutocompletePickerProps<D> {
  keyword: string;
  onSelect: (item: D) => void;
}
