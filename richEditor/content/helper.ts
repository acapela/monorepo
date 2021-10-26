import { RichEditorNode, RichEditorNodeWithAttributes } from "~richEditor/content/types";

function getNodesFromContentByTypeInner<AttributesType = unknown>(
  node: RichEditorNode,
  type: string,
  collectArray: RichEditorNodeWithAttributes<AttributesType>[]
): RichEditorNodeWithAttributes<AttributesType>[] {
  if (node.type === type) {
    collectArray.push(node as RichEditorNodeWithAttributes<AttributesType>);
  }

  if (!node.content) return collectArray;

  for (const childNode of node.content) {
    getNodesFromContentByTypeInner<AttributesType>(childNode, type, collectArray);
  }
  return collectArray;
}

export function getNodesFromContentByType<AttributesType = unknown>(
  node: RichEditorNode,
  type: string
): RichEditorNodeWithAttributes<AttributesType>[] {
  return getNodesFromContentByTypeInner(node, type, []);
}

export function getIsContentNodeOfType<AttributesType = unknown>(
  node: RichEditorNode,
  type: string
): node is RichEditorNodeWithAttributes<AttributesType> {
  return node.type === type;
}
