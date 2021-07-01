import { Editor } from "@tiptap/react";
import { createContext, useContext } from "react";
import { assert } from "~shared/assert";

const RichEditorReactContext = createContext<Editor | null>(null);

export const RichEditorContext = RichEditorReactContext.Provider;

export function useRichEditorContext() {
  const richEditorContext = useContext(RichEditorReactContext);

  assert(richEditorContext, "useRichEditorContext can only be called inside RichEditorContext");

  return richEditorContext;
}

export function useRichEditorIsEmpty() {
  const editor = useRichEditorContext();

  return editor.getCharacterCount() === 0;
}
