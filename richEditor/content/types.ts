import { JSONContent } from "@tiptap/react";

export type RichEditorNode = JSONContent;

export type RichEditorNodeWithAttributes<A> = JSONContent & { attrs: A };
