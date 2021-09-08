import { EditorContent, Extensions, JSONContent, useEditor } from "@tiptap/react";
import React, { useMemo } from "react";

import { richEditorExtensions } from "../preset";

export function getEmptyRichContent(): JSONContent {
  return {
    type: "doc",
    content: [],
  };
}

export interface RichEditorProps {
  content: JSONContent;
  extensions?: Extensions;
}

/**
 * This component renders JSON content.
 *
 * It supports rendering custom React nodes if some are registered with extensions.
 *
 * React-based nodes is the use-case where normal json-to-html rendering will not work as tiptap will only render static
 * placeholder for them.
 *
 * TODO: We can traverse the content to see if any node is react-based and then decide if we want to fallback to regular
 * static html rendering.
 *
 * This is, however, recommended way of rendering content in readonly mode (https://www.tiptap.dev/guide/node-views/#render-javascriptvuereact)
 *
 * TODO: Before thinking about some optimizations here, we can measure performance of this renderer.
 */
export const RichContentRenderer = ({ content = getEmptyRichContent(), extensions = [] }: RichEditorProps) => {
  const finalExtensions = useMemo(() => [...richEditorExtensions, ...extensions], [extensions]);
  const editor = useEditor(
    {
      extensions: finalExtensions,
      content,
      editable: false,
    },
    [content]
  );

  return <EditorContent editor={editor} />;
};
