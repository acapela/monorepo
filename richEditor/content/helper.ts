import { RichEditorNode, RichEditorNodeWithAttributes } from "~richEditor/content/types";

export function getNodesFromContentByType<AttributesType = unknown>(
  node: RichEditorNode,
  type: string
): RichEditorNodeWithAttributes<AttributesType>[] {
  let nodesOfRequestedType: RichEditorNodeWithAttributes<AttributesType>[] = [];
  if (node.type === type) {
    nodesOfRequestedType.push(node as RichEditorNodeWithAttributes<AttributesType>);
  }

  if (!node.content) return nodesOfRequestedType;

  for (const childNode of node.content) {
    nodesOfRequestedType = nodesOfRequestedType.concat(getNodesFromContentByType<AttributesType>(childNode, type));
  }
  return nodesOfRequestedType;
}
