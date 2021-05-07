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

interface KeyboardBinding {
  key: number;
  metaKey?: boolean | null;
  handler?: () => void;
}

declare module "quill" {
  // Quill type definition for keyboard does not include raw access to bindings priorities
  interface KeyboardStatic {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bindings: Record<string | number, KeyboardBinding[]>;
  }
}

export interface RichEditorProps {
  value: DeltaOperation[];
  onChange: (value: DeltaOperation[]) => void;
  onFilesSelected?: (files: File[]) => void;
  onSubmit?: () => void;
}

const ENTER_KEYCODE = 13;

export const RichEditor = ({ value, onChange, onSubmit, onFilesSelected }: RichEditorProps) => {
  const ref = useRef<ReactQuill>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const update = useUpdate();

  function handleChange() {
    const content = ref.current?.editor?.getContents().ops;

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
    const editor = ref.current?.editor;

    if (!editor) return;

    const cmdEnterSubmit: KeyboardBinding = {
      key: 13,
      metaKey: true,
      handler: () => {
        onSubmit?.();
      },
    };

    return addQuillBindingWithPriority(editor.keyboard, ENTER_KEYCODE, cmdEnterSubmit);
  }, [toolbarRef.current, onSubmit]);

  return (
    <>
      <QuillTheme />
      <div>
        {toolbarRef.current && (
          <ReactQuill
            ref={ref}
            theme="snow"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={valueDelta as any}
            onChange={handleChange}
            modules={{
              toolbar: toolbarRef.current,
            }}
          />
        )}
        <Toolbar ref={toolbarRef} onSubmit={onSubmit} onFilesSelected={onFilesSelected} />
      </div>
    </>
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
