import { createContext, RefObject, useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { assertGet } from "~shared/assert";

interface RichEditorContextData {
  reactQuillRef: RefObject<ReactQuill>;
}

const RichEditorReactContext = createContext<RichEditorContextData | null>(null);

export const RichEditorContext = RichEditorReactContext.Provider;

export function useRichEditorContext() {
  const richEditorContext = useContext(RichEditorReactContext);

  assertGet(richEditorContext, "useRichEditorContext can only be called inside RichEditorContext");

  return richEditorContext;
}

export function useRichEditorSelection() {
  const { reactQuillRef } = useRichEditorContext();

  const [selection, setSelection] = useState(() => {
    return reactQuillRef.current?.editor?.getSelection();
  });

  useEffect(() => {
    const editor = reactQuillRef.current?.editor;

    if (!editor) return;

    function handleSelectionChange() {
      setSelection(reactQuillRef.current?.editor?.getSelection());
    }

    editor.on("selection-change", handleSelectionChange);

    return () => {
      editor.off("selection-change", handleSelectionChange);
    };
  }, [reactQuillRef, reactQuillRef.current]);

  return selection;
}

export function useRichEditorIsEmpty(trim = true) {
  const { reactQuillRef } = useRichEditorContext();
  const [isEmpty, setIsEmpty] = useState(getIsEmptyNow);

  function getText() {
    const rawText = reactQuillRef.current?.editor?.getText() ?? "";

    if (!trim) return rawText;

    return rawText.trim();
  }

  function getIsEmptyNow() {
    return getText().length === 0;
  }

  useEffect(() => {
    const editor = reactQuillRef.current?.editor;

    if (!editor) return;

    function handleTextChange() {
      setIsEmpty(getIsEmptyNow());
    }

    editor.on("text-change", handleTextChange);

    return () => {
      editor.off("text-change", handleTextChange);
    };
  }, [reactQuillRef, reactQuillRef.current]);

  return isEmpty;
}

export function useRichEditorFormat(formatName: string, customValue?: string) {
  const selection = useRichEditorSelection();
  const { reactQuillRef } = useRichEditorContext();

  function getIsEnabled() {
    if (!selection) return false;

    const formatsMap = reactQuillRef.current?.editor?.getFormat(selection);

    const formatValue = formatsMap?.[formatName];

    const enabledValue = customValue ?? true;

    return formatValue === enabledValue;
  }

  const isEnabled = getIsEnabled();

  function toggle() {
    if (!selection) return;

    if (isEnabled) {
      reactQuillRef.current?.editor?.format(formatName, false);
      return;
    }

    reactQuillRef.current?.editor?.format(formatName, customValue ?? true);
  }

  return { isEnabled, toggle };
}
