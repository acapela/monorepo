import { DeltaStatic, DeltaOperation } from "quill";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";

import Delta from "quill-delta";
import { QuillTheme } from "./Theme";

console.log(React);

export interface RichEditorProps {
  value: DeltaOperation[];
  onChange: (value: DeltaOperation[]) => void;
}

export const RichEditor = ({ value, onChange }: RichEditorProps) => {
  const ref = useRef<ReactQuill>(null);

  function handleChange(value: string, delta: DeltaStatic) {
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
          value={valueDelta}
          onChange={handleChange}
          // value={[{ text: "Hello" }, { text: "World", bold: true }]}

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
