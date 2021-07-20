import { Editor, EditorContent, Extensions, JSONContent } from "@tiptap/react";
import { isEqual } from "lodash";
import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo } from "react";
import styled from "styled-components";
import { getFocusedElement } from "~shared/focus";
import { useConst } from "~shared/hooks/useConst";
import { useEqualDependencyChangeEffect } from "~shared/hooks/useEqualEffect";
import { createTimeout, wait } from "~shared/time";
import { borderRadius } from "~ui/baseStyles";
import { useAlphanumericShortcut } from "~ui/keyboard/useAlphanumericShortcut";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { RichEditorContent } from "./content/types";
import { RichEditorContext } from "./context";
import { useFileDroppedInContext } from "./DropFileContext";
import { richEditorExtensions } from "./preset";
import { richEditorContentCss } from "./Theme";
import { RichEditorSubmitMode, Toolbar } from "./Toolbar";
import { useDocumentFilesPaste } from "./useDocumentFilePaste";

export type { Editor } from "@tiptap/react";
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
  isDisabled?: boolean;
  extensions?: Extensions;
  onEditorReady?: (editor: Editor) => void;
}

export const RichEditor = forwardRef<Editor, RichEditorProps>(function RichEditor(
  {
    value = getEmptyRichContent(),
    onChange,
    onSubmit,
    onFilesSelected,
    additionalTopContent,
    additionalBottomContent,
    placeholder,
    autofocusKey,
    submitMode = "enable",
    isDisabled,
    extensions = [],
    onEditorReady,
  },
  ref
) {
  const finalExtensions = useMemo(() => [...richEditorExtensions, ...extensions], [extensions]);
  const editor = useConst(
    () =>
      new Editor({
        extensions: finalExtensions,
        content: value,
        enableInputRules: true,
      })
  );

  const isFocused = editor?.isFocused ?? false;

  useImperativeHandle(ref, () => {
    return editor;
  });

  useEffect(() => {
    /**
     * Under the hook, `EditorContent` is using 0ms timeout before it initializes the view.
     *
     * Sadly, there is no callback we can assign to be informed about when it's done. Therefore to be sure to
     * avoid race condition with this timeout, we'll wait 2 times for 0ms timeout and then inform that editor is ready.
     */

    let isStillMounted = true;
    async function waitAndInformEditorIsReady() {
      // First timeout is fired 'in the tick' time as EditorContent (as it uses componentDidMount) which
      // will be called together with this useEffect.
      await wait(0);
      // We want to make sure our callback will be fired after EditorContent init, so let's wait for another 'tick'
      await wait(0);

      // Make sure component was not unmounted in the meanwhile
      if (!isStillMounted) return;

      onEditorReady?.(editor);
    }

    waitAndInformEditorIsReady();

    return () => {
      isStillMounted = false;
    };
  }, [editor]);

  // Handle autofocus
  useEffect(() => {
    if (!editor || !autofocusKey) return;

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

  /**
   * Let's use any key pressed to instantly focus inside the editor
   */
  useAlphanumericShortcut(
    () => {
      // Don't support alphanumeric shortcut focus if anything has focus
      console.log("aaa", getFocusedElement());
      if (getFocusedElement()) return;
      /**
       * I initially wanted to run editor.chain().focus().insertContent(input).run(); to manually insert content
       * from alphanumeric shortcut. This however caused char to be inserted twice, even if I did stop propagation of the
       * event. I don't fully understand it, but it seems tiptap was watching somehow for this event very early as well.
       *
       * TLDR: only focusing the editor was enough - tiptap did capture keyboard event in such case and did properly
       * insert pressed key into the content.
       */
      editor?.chain().focus("end").run();
      return true;
    },
    { isEnabled: !isFocused && !isDisabled }
  );

  function handleSubmitIfEnabled() {
    if (submitMode !== "enable") return;

    onSubmit?.();
  }

  useFileDroppedInContext(
    (files) => {
      onFilesSelected?.(files);
    },
    { isDisabled }
  );

  useDocumentFilesPaste(
    (files) => {
      onFilesSelected?.(files);
    },
    { isDisabled }
  );

  function insertEmoji(emoji: string) {
    if (!editor) return;

    const contentToInsert = `${emoji} `;

    editor.chain().focus().insertContent(contentToInsert).run();
  }

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
            <EditorContent placeholder={placeholder} editor={editor} spellCheck readOnly={isDisabled} />
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
});

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
  min-height: 50px;
  overflow: auto;
  cursor: text;
`;

const UIHolder = styled.div`
  width: 100%;
  min-width: 500px;
  border: 1px solid #ccc;
  ${borderRadius.card}
`;
