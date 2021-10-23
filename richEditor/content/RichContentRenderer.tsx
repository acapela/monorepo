import { Editor, EditorContent, EditorOptions, Extensions, JSONContent, useEditor } from "@tiptap/react";
import React, { DependencyList, useEffect, useMemo, useState } from "react";
import { useUpdate } from "react-use";

import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";

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
 * Works exactly like tiptap useEditor hook, except on client side - will render editor on first render.
 *
 * Default one is 'hard-safe' against server side rendering and on first render always returns null (even if already on client side).
 *
 * This makes it impossible to create layout animations that requires no gaps between element existance to animate between positions.
 */
export const useClientEditor = (options: Partial<EditorOptions> = {}, deps: DependencyList = []) => {
  const forceUpdate = useUpdate();
  const [editor, setEditor] = useState<Editor | null>(() => {
    if (typeof document === "undefined") return null;

    return new Editor(options);
  });

  useDependencyChangeEffect(() => {
    const instance = new Editor(options);

    setEditor(instance);
  }, deps);

  useEffect(() => {
    if (!editor) return;

    editor.on("transaction", () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          forceUpdate();
        });
      });
    });

    return () => {
      editor.destroy();
    };
  }, [editor]);

  return editor;
};

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
  const editor = useClientEditor(
    {
      extensions: finalExtensions,
      content,
      editable: false,
    },
    [content]
  );

  return <EditorContent editor={editor} />;
};
