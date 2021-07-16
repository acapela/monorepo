import { EditorContent, Extensions, JSONContent, useEditor } from "@tiptap/react";
import { isEqual } from "lodash";
import React, { ReactNode, useEffect } from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { getFocusedElement } from "~shared/focus";
import { useEqualDependencyChangeEffect } from "~shared/hooks/useEqualEffect";
import { createTimeout } from "~shared/time";
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
    if (!editor || !autofocusKey) return;

    // Don't take focus away from other inputs etc if they're focused.
    if (getFocusedElement()) {
      return;
    }

    return createTimeout(() => {
      editor.chain?.().focus("end").run();
    }, 0);
  }, [autofocusKey, editor]);

  // Attach onChange prop to editor content changes.
  useEffect(() => {
    if (!editor || !onChange) return;

    const handleContentUpdate = () => {
      const content = editor.getJSON() as JSONContent;

      // Moves scroll to cursor when new line is added
      editor.chain().scrollIntoView().run();

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

    editor?.chain().focus().setContent(value).run();
  }, [value]);

  /**
   * We replace default enter handling.
   *
   * We'll use it to submit, while we'll map both shift+enter and mod+enter to default enter behavior.
   *
   * enter = submit + stop propagation (handled by useShortcut)
   * shift+enter / mod+enter > default enter behavior
   */
  useShortcut(
    "Enter",
    () => {
      handleSubmitIfEnabled();

      // Mark as handled which will prevent it from reaching editor itself
      return true;
    },
    {
      isEnabled: isFocused,
    }
  );

  function handleEnterShortcut() {
    editor?.commands.keyboardShortcut("Enter");

    return true;
  }

  useShortcut(["Shift", "Enter"], handleEnterShortcut, { isEnabled: isFocused });
  useShortcut(["Meta", "Enter"], handleEnterShortcut, { isEnabled: isFocused });

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
        <UIEditorContent
          onClick={() => {
            editor?.chain().focus().run();
          }}
        >
          {additionalTopContent}
          <UIEditorHolder>
            <EditorContent placeholder={placeholder} editor={editor} spellCheck />
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

  max-height: 25vh;
  overflow: auto;
  cursor: text;
`;

const UIHolder = styled.div`
  width: 100%;
  min-width: 500px;
  border: 1px solid #ccc;
  ${borderRadius.card}
`;
