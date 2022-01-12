import { JSONContent } from "@tiptap/core";
import { sortBy } from "lodash";

import { decisionOptionEntity } from "@aca/frontend/clientdb/decisionOption";
import { MessageEntity } from "@aca/frontend/clientdb/message";
import { getPerUserRequestMentionDataFromContent } from "@aca/shared/editor/mentions";
import { REQUEST_DECISION } from "@aca/shared/requests";

export function getDoesMessageContentIncludeDecisionRequests(content: JSONContent) {
  return getPerUserRequestMentionDataFromContent(content).some((mention) => mention.type === REQUEST_DECISION);
}

export interface DecisionOptionDraft {
  index: number;
  option: string;
}

export function createDecisionsForMessage(message: MessageEntity, options: DecisionOptionDraft[]) {
  if (!options.length) return;

  if (!getDoesMessageContentIncludeDecisionRequests(message.content)) return;

  // TODO PR: Check if it is needed (decision mention in content)

  const createdDecisionOptions = sortBy(options, "index").map((option) => {
    return message.db.getEntity(decisionOptionEntity).create({
      index: option.index,
      option: option.option,
      message_id: message.id,
    });
  });

  return createdDecisionOptions;
}
