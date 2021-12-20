import { JSONContent } from "@tiptap/react";

import { getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";

export function getMessageContentIncludesAnyRequests(content: JSONContent) {
  return getUniqueRequestMentionDataFromContent(content).length > 0;
}
