import { DeltaOperation } from "quill";
import Delta from "quill-delta";
import React, { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import { QuillTheme } from "./Theme";

export interface RichEditorProps {
  value: DeltaOperation[];
  onChange: (value: DeltaOperation[]) => void;
}

export const RichEditor = ({ value, onChange }: RichEditorProps) => {
  const ref = useRef<ReactQuill>(null);

  function handleChange() {
    const content = ref.current?.editor?.getContents().ops;

    console.log({ content });
    if (!content) {
      return;
    }

    onChange(content);
  }

  const valueDelta = useMemo(() => new Delta(value), [value]);

  return (
    <>
      <QuillTheme />
      <div>
        <ReactQuill
          ref={ref}
          theme="snow"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={valueDelta as any}
          onChange={handleChange}
          modules={{
            toolbar: [
              ["bold", "italic", "strike"], // toggled buttons
              ["code-block", "link"],

              [{ list: "ordered" }, { list: "bullet" }],
              ["blockquote"],
            ],
          }}
        />
      </div>
    </>
  );
};
