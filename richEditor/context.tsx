import { Editor } from "@tiptap/react";
import { createContext, useContext } from "react";

const RichEditorReactContext = createContext<Editor | null>(null);

export const RichEditorContext = RichEditorReactContext.Provider;

export function useRichEditorContext() {
  const richEditorContext = useContext(RichEditorReactContext);

  return richEditorContext;
}

export function useRichEditorIsEmpty() {
  const editor = useRichEditorContext();

  return editor?.getCharacterCount() === 0;
}
