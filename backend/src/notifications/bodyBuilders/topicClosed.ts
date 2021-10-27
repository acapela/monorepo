import { BlockCollection, Blocks, Elements } from "slack-block-builder";

import { SlackActionIds } from "../../slack/blocks";
import { NotificationMessage } from "../sendNotification";

interface Props {
  closedBy?: string | null;
  topicName: string;
  topicId: string;
  topicURL: string;
}

export function createSlackClosureMessage({
  closedBy,
  topicName,
  topicId,
  topicURL,
}: Props): Pick<NotificationMessage, "slack"> {
  // TODO: Waiting for Richard to give feedback on copy
  const sectionText = closedBy
    ? `*${closedBy}* closed *<${topicURL}|${topicName}>*`
    : `🎉 All requests have been actioned in <${topicURL}|${topicName}>. The topic is now closed. 💪`;

  return {
    slack: BlockCollection(
      Blocks.Section({ text: sectionText }),
      Blocks.Actions().elements(
        Elements.Button({ text: "Reopen" }).primary(true).value(topicId).actionId(SlackActionIds.ReOpenTopic),
        Elements.Button({ text: "Archive" }).value(topicId).actionId(SlackActionIds.ArchiveTopic)
      )
    ),
  };
}

export function createEmailClosureMessage({
  closedBy,
  topicName,
  topicURL,
}: Props): Pick<NotificationMessage, "email"> {
  const subject = closedBy ? `${topicName} was closed by ${closedBy}` : `${topicName} was closed`;
  const html = closedBy
    ? `Click <a href="${topicURL}">here</a> to see topic`
    : `🎉 All requests have been actioned in  <a href="${topicURL}">${topicName}</a>. The topic is now closed. 💪`;
  return {
    email: {
      subject,
      html,
    },
  };
}

export function createClosureNotificationMessage(props: Props): NotificationMessage {
  return {
    ...createEmailClosureMessage(props),
    ...createSlackClosureMessage(props),
  };
}
