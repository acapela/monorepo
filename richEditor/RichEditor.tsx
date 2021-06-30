import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { isEqual } from "lodash";
import React, { ReactNode, useEffect } from "react";
import styled from "styled-components";
import { useEqualDependencyChangeEffect } from "~shared/hooks/useEqualEffect";
import { borderRadius } from "~ui/baseStyles";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { RichEditorContent } from "./content/types";
import { RichEditorContext } from "./context";
import { useFileDroppedInContext } from "./DropFileContext";
import { richEditorExtensions } from "./preset";
import { richEditorContentCss } from "./Theme";
import { Toolbar, RichEditorSubmitMode } from "./Toolbar";
import { useDocumentFilesPaste } from "./useDocumentFilePaste";

export type { RichEditorSubmitMode } from "./Toolbar";

export function getEmptyRichContent(): JSONContent {
  return {
    type: "doc",
    content: [],
  };
}

export interface RichEditorProps {
  value: RichEditorContent;
  onChange?: (value: RichEditorContent) => void;
  onFilesSelected?: (files: File[]) => void;
  onSubmit?: () => void;
  additionalTopContent?: ReactNode;
  additionalBottomContent?: ReactNode;
  placeholder?: string;
  autofocusKey?: string;
  submitMode?: RichEditorSubmitMode;
}

export const RichEditor = ({
  value = getEmptyRichContent(),
  onChange,
  onSubmit,
  onFilesSelected,
  additionalTopContent,
  additionalBottomContent,
  placeholder,
  autofocusKey,
  submitMode = "enable",
}: RichEditorProps) => {
  const editor = useEditor({
    extensions: richEditorExtensions,
    content: value,
    enableInputRules: true,
  });

  const isFocused = editor?.isFocused ?? false;

  // Handle autofocus
  useEffect(() => {
    editor?.chain?.().focus().run();
  }, [autofocusKey]);

  // Attach onChange prop to editor content changes.
  useEffect(() => {
    if (!editor || !onChange) return;

    const handleContentUpdate = () => {
      const content = editor.getJSON() as JSONContent;

      onChange(content);
    };

    editor.on("update", handleContentUpdate);

    return () => {
      editor.off("update", handleContentUpdate);
    };
  }, [editor, onChange]);

  // Update the content if needed.
  useEqualDependencyChangeEffect(() => {
    const currentContent = editor?.state.toJSON().doc;

    const didChange = !isEqual(value, currentContent);

    if (!didChange) return;

    editor?.chain().setContent(value).run();
  }, [value]);

  /**
   * We replace default enter handling.
   *
   * We'll use it to submit, while we'll map both shift+enter and mod+enter to default enter behavior.
   *
   * enter = submit + stop propagation (handled by useShortcut)
   * shift+enter / mod+enter > default enter behavior
   */
  useShortcut("Enter", handleSubmitIfEnabled, { isEnabled: isFocused });

  function sendDefaultEnterCommandToEditor() {
    editor?.commands.keyboardShortcut("Enter");
  }

  useShortcut(["Shift", "Enter"], sendDefaultEnterCommandToEditor, { isEnabled: isFocused });
  useShortcut(["Meta", "Enter"], sendDefaultEnterCommandToEditor, { isEnabled: isFocused });

  function handleSubmitIfEnabled() {
    if (submitMode !== "enable") return;

    onSubmit?.();
  }

  useFileDroppedInContext((files) => {
    onFilesSelected?.(files);
  });

  useDocumentFilesPaste((files) => {
    onFilesSelected?.(files);
  });

  function insertEmoji(emoji: string) {
    if (!editor) return;

    const contentToInsert = `${emoji} `;

    editor.chain().focus().insertContent(contentToInsert).run();
  }

  // Handle server side rendering gracefully.
  if (!editor) return null;

  return (
    <UIHolder>
      <RichEditorContext value={editor}>
        {additionalTopContent && <UIAdditionalContent>{additionalTopContent}</UIAdditionalContent>}
        <UIEditorHolder>
          <EditorContent placeholder={placeholder} autoFocus editor={editor} spellCheck />
        </UIEditorHolder>

        {additionalBottomContent && <UIAdditionalContent>{additionalBottomContent}</UIAdditionalContent>}

        <Toolbar
          onSubmit={handleSubmitIfEnabled}
          onFilesSelected={onFilesSelected}
          onEmojiSelected={insertEmoji}
          submitMode={submitMode}
        />
      </RichEditorContext>
    </UIHolder>
  );
};

const UIEditorHolder = styled.div`
  flex-grow: 1;
  padding: 16px;
  ${richEditorContentCss};
`;

const UIHolder = styled.div`
  width: 100%;
  min-width: 570px;
  border: 1px solid #ccc;
  ${borderRadius.card}
`;

const UIAdditionalContent = styled.div`
  padding: 1rem;
`;
