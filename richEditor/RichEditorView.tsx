import { DeltaOperation, KeyboardStatic } from "quill";
import Delta from "quill-delta";
import React, { useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import { useIsomorphicLayoutEffect, useUpdate } from "react-use";
import { QuillTheme } from "./Theme";
import { Toolbar } from "./Toolbar";
import { useFileDroppedInContext } from "./DropFileContext";
import { useDocumentFilesPaste } from "./useDocumentFilePaste";
import { removeElementFromArray } from "~shared/array";
import styled from "styled-components";
import {
  registerEmojiModule,
  EMOJI_MODULE_NAME,
  EmojiModuleOptions,
  removeEmojiSearchTextUnderCursor,
} from "./emoji/module";
import { RichEditorContext } from "./context";
import { useChannel } from "~shared/channel";
import { EmojiSearchModal } from "./emoji/SearchModal";

interface KeyboardBinding {
  key: number;
  metaKey?: boolean | null;
  handler?: () => void;
}

declare module "quill" {
  // Quill type definition for keyboard does not include raw access to bindings priorities
  interface KeyboardStatic {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bindings: Record<number, KeyboardBinding[]>;
  }
}

export interface RichEditorProps {
  value: DeltaOperation[];
  onChange: (value: DeltaOperation[]) => void;
  onFilesSelected?: (files: File[]) => void;
  onSubmit?: () => void;
}

const ENTER_KEYCODE = 13;

registerEmojiModule();

export const RichEditor = ({ value, onChange, onSubmit, onFilesSelected }: RichEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const update = useUpdate();

  const emojiSearchKeywordChannel = useChannel<string | null>();

  function handleChange() {
    const content = quillRef.current?.editor?.getContents().ops;

    if (!content) {
      return;
    }

    onChange(content);
  }

  useIsomorphicLayoutEffect(() => {
    // We update on first render as we need toolbar dom ref ready when rendering quill
    // for the first time.
    update();
  }, []);

  const valueDelta = useMemo(() => new Delta(value), [value]);

  useFileDroppedInContext((files) => {
    onFilesSelected?.(files);
  });

  useDocumentFilesPaste((files) => {
    onFilesSelected?.(files);
  });

  useEffect(() => {
    const editor = quillRef.current?.editor;

    if (!editor) return;

    const cmdEnterSubmit: KeyboardBinding = {
      key: ENTER_KEYCODE,
      metaKey: true,
      handler: () => {
        onSubmit?.();
      },
    };

    return addQuillBindingWithPriority(editor.keyboard, ENTER_KEYCODE, cmdEnterSubmit);
  }, [toolbarRef.current, onSubmit]);

  const emojiModuleOptions = useMemo<EmojiModuleOptions>(() => {
    return {
      onKeywordChange(keyword) {
        emojiSearchKeywordChannel.publish(keyword);
      },
    };
  }, [emojiSearchKeywordChannel]);

  function insertEmoji(emoji: string) {
    const editor = quillRef.current?.editor;

    if (!editor) return;

    const contentToInsert = `${emoji} `;

    const caretPosition = editor.getSelection(true);

    editor.insertText(caretPosition.index, contentToInsert, "user");

    removeEmojiSearchTextUnderCursor(editor);

    const selectionIndex = editor.getSelection()?.index;

    if (!selectionIndex) return;

    editor.setSelection(selectionIndex + contentToInsert.length, 0);
  }

  return (
    <UIHolder>
      <RichEditorContext value={{ reactQuillRef: quillRef }}>
        <QuillTheme />
        <EmojiSearchModal keywordChannel={emojiSearchKeywordChannel} onEmojiSelected={insertEmoji} />
        <UIEditorHolder>
          {toolbarRef.current && (
            <ReactQuill
              ref={quillRef}
              theme="snow"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value={valueDelta as any}
              onChange={handleChange}
              modules={{
                [EMOJI_MODULE_NAME]: emojiModuleOptions,
                toolbar: toolbarRef.current,
              }}
            />
          )}
          <Toolbar
            ref={toolbarRef}
            quillRef={quillRef}
            onSubmit={onSubmit}
            onFilesSelected={onFilesSelected}
            onEmojiSelected={insertEmoji}
          />
        </UIEditorHolder>
      </RichEditorContext>
    </UIHolder>
  );
};

/**
 * This is alternative to .addBinding method on Quill keyboard module.
 *
 * It works almost the same with the difference binding will be added at the beginning of handlers
 * instead of the end allowing it to be called even if other bindings call .stopPropagation etc.
 */
function addQuillBindingWithPriority(keyboard: KeyboardStatic, keyCode: number, binding: KeyboardBinding) {
  let bindingsList = keyboard.bindings[keyCode];

  if (!bindingsList) {
    bindingsList = [];
    keyboard.bindings[keyCode] = bindingsList;
  }

  bindingsList.unshift(binding);

  return () => {
    removeElementFromArray(bindingsList, binding);
  };
}

const UIEditorHolder = styled.div`
  flex-grow: 1;
`;

const UIHolder = styled.div`
  width: 100%;
`;
