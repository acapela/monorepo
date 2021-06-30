import { RichEditorContent } from "./types";

import { convertMessageContentToPlainText } from "./plainText";

export function isRichEditorContentEmpty(content: RichEditorContent) {
  // TODO: There is probably a cheaper method of checking if content editor is empty than converting entire JSON content to text.
  const text = convertMessageContentToPlainText(content);

  return text.trim().length === 0;
}
