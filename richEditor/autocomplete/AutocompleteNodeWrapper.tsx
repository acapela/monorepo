import { JSONContent, NodeViewWrapper } from "@tiptap/react";
import { ComponentType } from "react";
import { AutocompleteNodeProps } from "./component";

interface Props<D> {
  type: string;
  data: D;
  node: JSONContent;
  NodeComponent: ComponentType<AutocompleteNodeProps<D>>;
}

export function AutocompleteNodeWrapper<D>({ data, NodeComponent, type, node }: Props<D>) {
  return (
    <NodeViewWrapper className={`node-${type}`} as="span">
      <NodeComponent data={data} node={node} />
    </NodeViewWrapper>
  );
}
