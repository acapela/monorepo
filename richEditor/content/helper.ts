import { RichEditorContent } from "~richEditor/content/types";

export function getNodesFromContentByType(node: RichEditorContent, type: string): RichEditorContent[] {
  let res: RichEditorContent[] = [];
  if (node.type === type) res = [node];

  if (!node.content) return res;

  for (const n of node.content) {
    res = res.concat(getNodesFromContentByType(n, type));
  }
  return res;
}
