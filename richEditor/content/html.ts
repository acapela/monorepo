import { generateHTML } from "@tiptap/html";
import { richEditorExtensions } from "~richEditor/preset";
import { RichEditorContent } from "./types";

export function convertRichEditorContentToHtml(content: RichEditorContent) {
  return generateHTML(content, richEditorExtensions);
}
