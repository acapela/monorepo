import { Block, KnownBlock } from "@slack/bolt";

import { SlackActionIds } from ".";

interface Props {
  closedBy: string;
  topicName: string;
  topicId: string;
  topicURL: string;
}

export function createClosureMessage({ closedBy, topicName, topicId, topicURL }: Props): (KnownBlock | Block)[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${closedBy}* closed *<${topicURL}|${topicName}>*`,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            emoji: false,
            text: "Reopen",
          },
          style: "primary",
          value: topicId,
          action_id: SlackActionIds.ReOpenTopic,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            emoji: false,
            text: "Archive",
          },
          style: "danger",
          action_id: SlackActionIds.ArchiveTopic,
          value: topicId,
        },
      ],
    },
  ];
}
