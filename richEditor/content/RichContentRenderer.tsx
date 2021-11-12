import { Editor, EditorContent, EditorOptions, Extensions, JSONContent } from "@tiptap/react";
import React, { useEffect, useMemo, useState } from "react";

import { useEqualDependencyChangeEffect } from "~shared/hooks/useEqualEffect";

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

//
/**
 * Works exactly like tiptap useEditor hook, except on client side - will render editor on first render.
 *
 * Default one is 'hard-safe' against server side rendering and on first render always returns null (even if already on client side).
 *
 * This makes it impossible to create layout animations that requires no gaps between element existance to animate between positions.
 */
export const useClientEditor = (options: Partial<EditorOptions> = {}) => {
  const [editor, setEditor] = useState<Editor | null>(() => {
    if (typeof document === "undefined") return null;

    return new Editor(options);
  });

  useEffect(() => {
    const instance = new Editor(options);

    setEditor(instance);
  }, []);

  useEffect(() => {
    if (!editor) return;

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
 */
export const RichContentRenderer = ({ content = getEmptyRichContent(), extensions = [] }: RichEditorProps) => {
  const finalExtensions = useMemo(() => [...richEditorExtensions, ...extensions], [extensions]);

  const editor = useClientEditor({
    extensions: finalExtensions,
    content,
    editable: false,
  });

  useEqualDependencyChangeEffect(() => {
    editor?.commands.setContent(content);
  }, [content]);

  return <EditorContent editor={editor} />;
};
