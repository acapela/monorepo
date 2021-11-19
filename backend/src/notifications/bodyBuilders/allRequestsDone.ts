import { BlockCollection, Blocks, Elements } from "slack-block-builder";

import { createSlackLink } from "~backend/src/slack/md/utils";
import { SlackActionIds } from "~backend/src/slack/utils";

import { NotificationMessage } from "../sendNotification";

interface Props {
  topicId: string;
  topicName: string;
  topicURL: string;
}

export function createSlackAllRequestsDoneMessage({
  topicId,
  topicName,
  topicURL,
}: Props): Pick<NotificationMessage, "slack"> {
  const sectionText = `🎉 All requests have been actioned in ${createSlackLink(
    topicURL,
    topicName
  )}. The topic awaits your review 👀.`;

  return {
    slack: BlockCollection(
      Blocks.Section({ text: sectionText }),
      Blocks.Actions().elements(
        Elements.Button({ text: "Review" }).primary(true).url(topicURL),
        Elements.Button({ text: "Close & Archive" }).value(topicId).actionId(SlackActionIds.ArchiveTopic)
      )
    ),
  };
}

export function createAllRequestsDoneEmailMessage({ topicName, topicURL }: Props): Pick<NotificationMessage, "email"> {
  const subject = `${topicName} is ready for review`;
  const html = `🎉 All requests have been actioned in  <a href="${topicURL}">${topicName}</a>. The topic awaits your review 👀.`;
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
