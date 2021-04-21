import { Suspense, useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import { namedLazy } from "~shared/namedLazy";
import type { RichEditorProps } from "./RichEditorView";
import { ComponentType, lazy } from "react";
import { PickByValue } from "utility-types";
import type { DeltaOperation } from "quill";

export type EditorContent = DeltaOperation[];

export const RichEditor = (props: RichEditorProps) => {
  return (
    <Suspense fallback="Loading editor">
      <LazyRichEditor {...props} />
    </Suspense>
  );
};

const LazyRichEditor = namedLazy(() => import("./RichEditorView"), "RichEditor");
