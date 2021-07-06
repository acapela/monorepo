import { EditorContent, Extensions, JSONContent, useEditor } from "@tiptap/react";
import { isEqual } from "lodash";
import React, { ReactNode, useEffect } from "react";
import { useMemo } from "react";
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
  disableFileDrop?: boolean;
  extensions?: Extensions;
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
  disableFileDrop,
  extensions = [],
}: RichEditorProps) => {
  const finalExtensions = useMemo(() => [...richEditorExtensions, ...extensions], [extensions]);
  const editor = useEditor({
    extensions: finalExtensions,
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
  useShortcut("Enter", handleSubmitIfEnabled, {
    isEnabled: isFocused,
    // Allow children of the editor to stopPropagation of Enter shortcut. Use case might be eg. popovers with enter support
    phase: "bubble",
  });

  function sendDefaultEnterCommandToEditor() {
    editor?.commands.keyboardShortcut("Enter");
  }

  useShortcut(["Shift", "Enter"], sendDefaultEnterCommandToEditor, { isEnabled: isFocused });
  useShortcut(["Meta", "Enter"], sendDefaultEnterCommandToEditor, { isEnabled: isFocused });

  function handleSubmitIfEnabled() {
    if (submitMode !== "enable") return;

    onSubmit?.();
  }

  useFileDroppedInContext(
    (files) => {
      onFilesSelected?.(files);
    },
    { isDisabled: disableFileDrop }
  );

  useDocumentFilesPaste(
    (files) => {
      onFilesSelected?.(files);
    },
    { isDisabled: disableFileDrop }
  );

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
        <UIEditorContent>
          {additionalTopContent}
          <UIEditorHolder>
            <EditorContent placeholder={placeholder} autoFocus editor={editor} spellCheck />
          </UIEditorHolder>
          {additionalBottomContent}
        </UIEditorContent>
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
  ${richEditorContentCss};
`;

const UIEditorContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UIHolder = styled.div`
  width: 100%;
  min-width: 570px;
  border: 1px solid #ccc;
  ${borderRadius.card}
`;
