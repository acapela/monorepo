import { BlockCollection, Blocks, Elements } from "slack-block-builder";

import { createSlackLink } from "~backend/src/slack/md/utils";
import { SlackActionIds } from "~backend/src/slack/utils";

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
  const sectionText = closedBy
    ? `*${closedBy}* closed *${createSlackLink(topicURL, topicName)}*`
    : `🎉 ${createSlackLink(
        topicURL,
        topicName
      )} has all requests and conversations completed. The topic is now closed. 💪`;

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
    : `🎉 <a href="${topicURL}">${topicName}</a> has all requests and conversations completed. The topic is now closed. 💪`;
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
