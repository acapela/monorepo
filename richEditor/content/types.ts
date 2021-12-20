import { JSONContent } from "@tiptap/react";

export type RichEditorNode = JSONContent;

export type RichEditorNodeTypedNode<A, Type = string> = JSONContent & { type: Type; attrs: A };
