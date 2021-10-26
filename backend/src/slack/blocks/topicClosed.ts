import { Block, KnownBlock } from "@slack/bolt";
import { BlockCollection, Blocks, Elements } from "slack-block-builder";

import { SlackActionIds } from ".";

interface Props {
  closedBy: string;
  topicName: string;
  topicId: string;
  topicURL: string;
}

export function createClosureMessage({ closedBy, topicName, topicId, topicURL }: Props): (KnownBlock | Block)[] {
  return BlockCollection(
    Blocks.Section({ text: `*${closedBy}* closed *<${topicURL}|${topicName}>*` }),
    Blocks.Actions().elements(
      Elements.Button({ text: "Reopen" }).primary(true).value(topicId).actionId(SlackActionIds.ReOpenTopic),
      Elements.Button({ text: "Archive" }).value(topicId).actionId(SlackActionIds.ArchiveTopic)
    )
  );
}
