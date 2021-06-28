import { RichEditorContent } from "./types";
import { convert } from "html-to-text";
import { convertRichEditorContentToHtml } from "./html";

export function convertMessageContentToPlainText(content: RichEditorContent) {
  const contentHTML = convertRichEditorContentToHtml(content);

  const plainText = convert(contentHTML);

  return plainText;
}
