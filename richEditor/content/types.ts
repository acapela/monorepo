import { JSONContent } from "@tiptap/react";

export type RichEditorNode = JSONContent;

export type RichEditorNodeWithAttributes<A> = Omit<JSONContent, "attrs"> & { attrs: A };
