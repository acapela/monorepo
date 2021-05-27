import type { DeltaOperation } from "quill";
import { Suspense } from "react";
import { namedLazy } from "~shared/namedLazy";
import type { RichEditorProps } from "./RichEditorView";

export type EditorContent = DeltaOperation[];

export const RichEditor = (props: RichEditorProps) => {
  return (
    <Suspense fallback="Loading editor">
      <LazyRichEditor {...props} />
    </Suspense>
  );
};

/**
 * We're making quill lazy component for 2 reasons:
 * 1. It is not optimized for server side rendering and might reference document on setup which can lead to errors.
 * 2. It's quite big component.
 */

const LazyRichEditor = namedLazy(() => import("./RichEditorView"), "RichEditor");

LazyRichEditor.preload();
