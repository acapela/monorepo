import { ChainedCommands, Editor, EditorContent, JSONContent } from "@tiptap/react";
import { isEqual } from "lodash";
import React, { useCallback, useEffect, useImperativeHandle } from "react";
import { useUpdate } from "react-use";
import styled from "styled-components";

import { messageComposerExtensions } from "~frontend/message/extensions";
import { isRichEditorContentEmpty } from "~richEditor/content/isEmpty";
import { RichEditorNode } from "~richEditor/content/types";
import { RichEditorContext } from "~richEditor/context";
import { richEditorExtensions } from "~richEditor/preset";
import { richEditorContentCss } from "~richEditor/Theme";
import { getFocusedElement } from "~shared/focus";
import { useConst } from "~shared/hooks/useConst";
import { useEqualDependencyChangeEffect } from "~shared/hooks/useEqualEffect";
import { namedForwardRef } from "~shared/react/namedForwardRef";
import { useAlphanumericShortcut } from "~ui/keyboard/useAlphanumericShortcut";
import { useShortcut } from "~ui/keyboard/useShortcut";

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

export interface Props {
  value: RichEditorNode;
  onChange?: (value: RichEditorNode) => void;
  onSubmit?: () => void;
  placeholder?: string;
  isDisabled?: boolean;
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

export const NewRequestRichEditor = namedForwardRef<Editor, Props>(function RichEditor(
  { value = getEmptyRichContent(), onChange, onSubmit, placeholder, isDisabled },
  ref
) {
  const editor = useConst(
    () =>
      new Editor({
        extensions: [...richEditorExtensions, ...messageComposerExtensions],
        content: value,
        enableInputRules: true,
      })
  );

  const forceUpdate = useUpdate();

  const getFocusAtEndCommand = useCallback(() => getFocusEditorAtEndCommand(editor), [editor]);

  useEffect(() => {
    editor.on("transaction", forceUpdate);

    return () => {
      editor.off("transaction", forceUpdate);
    };
  }, [editor, forceUpdate]);

  const isFocused = editor?.isFocused ?? false;

  useImperativeHandle(ref, () => {
    return editor;
  });

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

    getFocusAtEndCommand().setContent(value).run();
  }, [value]);

  useShortcut(["Shift", "Enter"], handleSubmit, { isEnabled: isFocused });
  useShortcut(["Meta", "Enter"], handleSubmit, { isEnabled: isFocused });

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

  function handleSubmit() {
    onSubmit?.();
  }

  function handleEditorClick() {
    if (isRichEditorContentEmpty(value)) {
      getFocusAtEndCommand().run();
    }

    // If editor is not empty - tiptap will manually (or even dom?) put the cursor in a proper place.
  }

  return (
    <UIHolder>
      <RichEditorContext value={editor}>
        <UIEditorContent onClick={handleEditorClick}>
          <EditorContent placeholder={placeholder} editor={editor} spellCheck readOnly={isDisabled} />
        </UIEditorContent>
      </RichEditorContext>
    </UIHolder>
  );
});

const UIEditorContent = styled.div<{}>`
  flex-grow: 1;
  ${richEditorContentCss};

  min-height: 16px;
  overflow: auto;
  cursor: text;
`;

const UIHolder = styled.div<{}>`
  width: 100%;
  min-width: 500px;
`;
