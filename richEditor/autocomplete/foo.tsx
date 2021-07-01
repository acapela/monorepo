import { NodeViewWrapper } from "@tiptap/react";
import { AutocompleteNodeProps, AutocompletePickerProps } from "./component";
import { createAutocompletePlugin } from "./mention";

interface Data {
  foo: string;
}

function Node(props: AutocompleteNodeProps<Data>) {
  return "yo99922";
}

function Picker({ keyword, onSelect }: AutocompletePickerProps<Data>) {
  // console.log("picker render", props);
  return (
    <NodeViewWrapper className="picker">
      <div>{keyword}</div>
      <span
        onClick={() => {
          onSelect({ foo: "yo2" });
        }}
      >
        yo2
      </span>
    </NodeViewWrapper>
  );
}

export const Foo = createAutocompletePlugin<Data>({
  type: "foo",
  triggerChar: "@",
  nodeComponent: Node,
  pickerComponent: Picker,
});
