import { BlockCollection, Blocks, Elements, Md } from "slack-block-builder";

import { createSlackLink } from "~backend/src/slack/md/utils";
import { SlackActionIds } from "~backend/src/slack/utils";

import { NotificationMessage } from "../sendNotification";

interface Props {
  topicId: string;
  topicName: string;
  topicURL: string;
  taskCreatorName: string;
}

export function createRequestIsDue({
  taskCreatorName,
  topicId,
  topicName,
  topicURL,
}: Props): Partial<NotificationMessage> {
  const messageSlack = `We noticed your task in ${createSlackLink(
    topicURL,
    topicName
  )} is due in the next 3 hours. Can you finish it before that or should you let ${taskCreatorName} know you need more time?`;
  const messageHtml = `We noticed your task in  <a href="${topicURL}">${topicName}</a> is due in the next 3 hours. Can you finish it before that or should you let ${taskCreatorName} know you need more time?`;
  return {
    email: {
      subject: `You have uncompleted tasks in ${topicName}.`,
      html: messageHtml,
    },
    slack: BlockCollection(
      Blocks.Section({ text: messageSlack }),
      Blocks.Actions().elements(
        Elements.Button({
          actionId: "open_view_request_modal",
          value: topicId,
          text: "View Request",
        }).primary(true)
      )
    ),
  };
}
