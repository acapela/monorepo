import { BlockCollection, Blocks, Elements, Md } from "slack-block-builder";

import { SlackActionIds } from "@aca/backend/src/slack/utils";

import { NotificationMessage } from "../sendNotification";

interface Props {
  topicId: string;
  topicName: string;
  topicURL: string;
}

export function createSlackAllRequestsDoneMessage({ topicId, topicName }: Props): Pick<NotificationMessage, "slack"> {
  const sectionText = `All tasks have been completed in ${Md.bold(
    topicName
  )}. The request will automatically be closed in 24 hours.`;

  return {
    slack: BlockCollection(
      Blocks.Section({ text: sectionText }),
      Blocks.Actions().elements(
        Elements.Button({
          actionId: SlackActionIds.OpenViewRequestModal,
          value: topicId,
          text: "View Request",
        }).primary(true),
        Elements.Button({ text: "Close & Archive" }).value(topicId).actionId(SlackActionIds.ArchiveTopic)
      )
    ),
  };
}

export function createAllRequestsDoneEmailMessage({ topicName, topicURL }: Props): Pick<NotificationMessage, "email"> {
  const subject = `All tasks have been completed in ${topicName}.`;
  const html = `All tasks have been completed in  <a href="${topicURL}">${topicName}</a>. The request will automatically be closed in 24 hours.`;
  return {
    email: {
      subject,
      html,
    },
  };
}

export function createAllRequestsDoneNotificationMessage(props: Props): Partial<NotificationMessage> {
  return {
    ...createAllRequestsDoneEmailMessage(props),
    ...createSlackAllRequestsDoneMessage(props),
  };
}
