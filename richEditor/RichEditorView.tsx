import { DeltaOperation } from "quill";
import Delta from "quill-delta";
import React, { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import { useIsomorphicLayoutEffect, useUpdate } from "react-use";
import { QuillTheme } from "./Theme";
import { Toolbar } from "./Toolbar";
import { useFileDroppedInContext } from "./DropFileContext";
import { useDocumentFilesPaste } from "./useDocumentFilePaste";

export interface RichEditorProps {
  value: DeltaOperation[];
  onChange: (value: DeltaOperation[]) => void;
  onFilesSelected?: (files: File[]) => void;
  onSubmit?: () => void;
}

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
              // toolbar: [
              //   ["bold", "italic", "strike"], // toggled buttons
              //   ["code-block", "link"],

              //   [{ list: "ordered" }, { list: "bullet" }],
              //   ["blockquote"],
              // ],
            }}
          />
        )}
        <Toolbar ref={toolbarRef} onSubmit={onSubmit} onFilesSelected={onFilesSelected} />
      </div>
    </>
  );
};
