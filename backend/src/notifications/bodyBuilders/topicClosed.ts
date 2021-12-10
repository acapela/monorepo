import { BlockCollection, Blocks, Elements, Md } from "slack-block-builder";

import { SlackActionIds } from "~backend/src/slack/utils";

import { NotificationMessage } from "../sendNotification";

interface Props {
  closedBy?: string | null;
  topicName: string;
  topicId: string;
  topicURL: string;
}

export function createSlackClosureMessage({ closedBy, topicName, topicId }: Props): Pick<NotificationMessage, "slack"> {
  const sectionText = closedBy
    ? `${Md.bold(closedBy)} closed ${Md.bold(topicName)}`
    : `All tasks have been completed in ${Md.bold(topicName)} The request is now closed.`;

  return {
    slack: BlockCollection(
      Blocks.Section({ text: sectionText }),
      Blocks.Actions().elements(
        Elements.Button({
          actionId: SlackActionIds.OpenViewRequestModal,
          value: topicId,
          text: "View Request",
        }).primary(true),
        Elements.Button({ text: "Reopen" }).value(topicId).actionId(SlackActionIds.ReOpenTopic),
        Elements.Button({ text: "Archive" }).value(topicId).actionId(SlackActionIds.ArchiveTopic).danger(true)
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
    ? `Click <a href="${topicURL}">here</a> to see the request.`
    : `All tasks have been completed in <a href="${topicURL}">${topicName}</a>. The request is now closed.`;
  return {
    email: {
      subject,
      html,
    },
  };
}

export function createClosureNotificationMessage(props: Props): Partial<NotificationMessage> {
  return {
    ...createEmailClosureMessage(props),
    ...createSlackClosureMessage(props),
  };
}
