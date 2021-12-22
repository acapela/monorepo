import { JSONContent } from "@tiptap/react";

import { getPerUserRequestMentionDataFromContent } from "~shared/editor/mentions";

export function getMessageContentIncludesAnyRequests(content: JSONContent) {
  return getPerUserRequestMentionDataFromContent(content).length > 0;
}
