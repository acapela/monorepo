import { JSONContent } from "@tiptap/core";

export function doc(content: JSONContent[]): JSONContent {
  return { type: "doc", content };
}

export function paragraph() {}

export function list() {}

export function listItem() {}
