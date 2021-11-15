import { Editor } from "@tiptap/core";
import { NodeViewProps } from "@tiptap/react";
import { SuggestionProps } from "@tiptap/suggestion";

export interface AutocompleteNodeProps<D> {
  data: D;
  isEditable: boolean;
  node: NodeViewProps["node"];
  update: (attributesToUpdate: Partial<D>) => void;
  editor: Editor;
}

export type AutocompletePickerProps<D> = SuggestionProps & {
  keyword: string;
  onSelect: (item: D[]) => void;
};
