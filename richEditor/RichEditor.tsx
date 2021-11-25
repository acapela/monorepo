import Placeholder from "@tiptap/extension-placeholder";
import { ChainedCommands, Editor, EditorContent, Extensions, JSONContent } from "@tiptap/react";
import React, { ReactNode, useEffect, useImperativeHandle, useMemo } from "react";
import { useUpdate } from "react-use";
import styled, { StylesPart } from "styled-components";

import { getFocusedElement } from "~shared/focus";
import { useConst } from "~shared/hooks/useConst";
import { useEqualDependencyChangeEffect } from "~shared/hooks/useEqualEffect";
import { isPlainObjectEqual } from "~shared/isPlainObjectEqual";
import { namedForwardRef } from "~shared/react/namedForwardRef";
import { createTimeout, wait } from "~shared/time";
import { useAlphanumericShortcut } from "~ui/keyboard/useAlphanumericShortcut";
import { useShortcut } from "~ui/keyboard/useShortcut";

import { isRichEditorContentEmpty } from "./content/isEmpty";
import { RichEditorNode } from "./content/types";
import { RichEditorContext } from "./context";
import { useFileDroppedInContext } from "./DropFileContext";
import { richEditorExtensions } from "./preset";
import { richEditorContentCss } from "./Theme";
import { useDocumentFilesPaste } from "./useDocumentFilePaste";

export type { Editor } from "@tiptap/react";

export function getEmptyRichContent(): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
  };
}

export interface RichEditorProps {
  value: RichEditorNode;
  onChange?: (value: RichEditorNode) => void;
  onFilesSelected?: (files: File[]) => void;
  additionalTopContent?: ReactNode;
  additionalBottomContent?: ReactNode;
  placeholder?: string;
  autofocusKey?: string;
  isDisabled?: boolean;
  extensions?: Extensions;
  onEditorReady?: (editor: Editor) => void;
  customEditFieldStyles?: StylesPart;
  capturePastedFiles?: boolean;
}

/**
 * This is a bit tricky.
 *
 * It seems like this function should not be needed and editor.chain().focus('end') should be enough.
 *
 * Turns out 'end' focus puts cursor at content.size position, which is 'after' selectable area which I don't fully understand.
 *
 * Example:
 * Creating some complex content (eg bullet lists) you might do 2 things:
 * - call content.size and also manually (by mouse or keyboard) put cursor at the end of visible content and then measure
 * cursor position.
 *
 * Turns out those are different numbers. content.size is always bigger. I think it is a bug in tiptap as looking at
 * focus('end') implementation it is exactly what happens (pseudo code: focusAt(content.size)).
 *
 * This leads to bunch of weird behaviors eg. if you have 1 line content, focus('end') and then press backspace twice,
 * it'll first select entire content and then remove your entire content.
 *
 * So long story short - this function will get last cursor position that is able to resolve to actual node.
 */
function getLastSelectableCursorPosition(editor: Editor) {
  // Let's get content size and start from there looking for first 'selectable' cursor position
  const contentSize = editor.state.doc.content.size;

  let cursorPosition = contentSize;

  // Start looking until will reach 'start' position.
  while (cursorPosition > 1) {
    // Let's check if there is an actual node at this cursor position
    const node = editor.state.doc.nodeAt(cursorPosition);

    // If there is - set position of cursor 'just after' this node.
    if (node) {
      return cursorPosition + 1;
    }

    // Keep looking
    cursorPosition--;
  }

  // We've reached 'start' position so let's return it.
  return 1;
}

function getFocusEditorAtEndCommand(editor: Editor): ChainedCommands {
  const lastSelectablePosition = getLastSelectableCursorPosition(editor);
  return editor.chain().focus(lastSelectablePosition);
}

export const RichEditor = namedForwardRef<Editor, RichEditorProps>(function RichEditor(
  {
    value = getEmptyRichContent(),
    onChange,
    onFilesSelected,
    additionalTopContent,
    additionalBottomContent,
    placeholder,
    autofocusKey,
    isDisabled,
    extensions = [],
    onEditorReady,
    customEditFieldStyles,
    capturePastedFiles,
  },
  ref
) {
  const placeholderPlugin = useMemo(
    () =>
      Placeholder.configure({
        placeholder,
      }),
    [placeholder]
  );

  const finalExtensions = useMemo(
    () => [...richEditorExtensions, placeholderPlugin, ...extensions],
    [extensions, placeholderPlugin]
  );

  const editor = useConst(
    () =>
      new Editor({
        extensions: finalExtensions,
        content: value,
        enableInputRules: true,
      })
  );

  const forceUpdate = useUpdate();

  function getFocusAtEndCommand() {
    return getFocusEditorAtEndCommand(editor);
  }

  useEffect(() => {
    editor.on("transaction", forceUpdate);

    return () => {
      editor.off("transaction", forceUpdate);
    };
  }, [editor]);

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
      getFocusAtEndCommand().run();
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

    const didChange = !isPlainObjectEqual(value, currentContent);

    if (!didChange) return;

    getFocusAtEndCommand().setContent(value).run();
  }, [value]);

  /**
   * Let's use any key pressed to instantly focus inside the editor
   */
  useAlphanumericShortcut(
    () => {
      // Don't support alphanumeric shortcut focus if anything has focus
      if (getFocusedElement()) return;
      /**
       * I initially wanted to run editor.chain().focus().insertContent(input).run(); to manually insert content
       * from alphanumeric shortcut. This however caused char to be inserted twice, even if I did stop propagation of the
       * event. I don't fully understand it, but it seems tiptap was watching somehow for this event very early as well.
       *
       * TLDR: only focusing the editor was enough - tiptap did capture keyboard event in such case and did properly
       * insert pressed key into the content.
       */
      getFocusAtEndCommand().run();
      return true;
    },
    { isEnabled: !isFocused && !isDisabled }
  );

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
    { isDisabled: isDisabled || !capturePastedFiles }
  );

  // function insertEmoji(emoji: string) {
  //   if (!editor) return;

  //   const contentToInsert = `${emoji} `;

  //   editor.chain().focus().insertContent(contentToInsert).run();
  // }

  function handleEditorClick() {
    if (isRichEditorContentEmpty(value)) {
      getFocusAtEndCommand().run();
    }

    // If editor is not empty - tiptap will manually (or even dom?) put the cursor in a proper place.
  }

  // Let's mimic Notion shortcut for strike
  useShortcut(["Mod", "Shift", "S"], () => {
    editor.chain().toggleStrike().run();
    return true;
  });

  useEffect(() => {
    if (!editor) return;
    // This is temporary fix till https://github.com/ueberdosis/tiptap/issues/2143 is published
    document.querySelector("style[data-tiptap-style]")?.removeAttribute("data-tiptap-style");
  }, [editor]);

  return (
    <UIHolder>
      <RichEditorContext value={editor}>
        <UIEditorContent onClick={handleEditorClick}>
          {additionalTopContent}
          <UIEditorHolder customEditFieldStyles={customEditFieldStyles} data-test-richeditor>
            <EditorContent placeholder={placeholder} editor={editor} spellCheck readOnly={isDisabled} />
          </UIEditorHolder>
          {additionalBottomContent}
        </UIEditorContent>
      </RichEditorContext>
    </UIHolder>
  );
});

const UIEditorHolder = styled.div<{ customEditFieldStyles?: StylesPart }>`
  flex-grow: 1;
  ${(props) => props.customEditFieldStyles};
  overflow-x: hidden;
  ${richEditorContentCss};
`;

const UIEditorContent = styled.div<{}>`
  display: flex;

  flex-direction: column;
  gap: 16px;

  overflow: auto;
  cursor: text;
`;

const UIHolder = styled.div<{}>`
  width: 100%;
  min-width: 0; ;
`;
