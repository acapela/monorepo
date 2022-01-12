import { JSONContent } from "@tiptap/react";

import { RichEditorNode, RichEditorNodeTypedNode } from "@aca/richEditor/content/types";

function getNodesFromContentByTypeInner<AttributesType = unknown>(
  node: RichEditorNode,
  type: string,
  collectArray: RichEditorNodeTypedNode<AttributesType>[]
): RichEditorNodeTypedNode<AttributesType>[] {
  if (node.type === type) {
    collectArray.push(node as RichEditorNodeTypedNode<AttributesType>);
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
): RichEditorNodeTypedNode<AttributesType>[] {
  return getNodesFromContentByTypeInner(node, type, []);
}

export function getIsContentNodeOfType<AttributesType = unknown>(
  node: RichEditorNode,
  type: string
): node is RichEditorNodeTypedNode<AttributesType> {
  return node.type === type;
}

export function getNewRichContentWithNodes(nodes: JSONContent[]): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: nodes,
      },
    ],
  };
}

export function createRichEditorTextNode(text: string): JSONContent {
  return { type: "text", text };
}
