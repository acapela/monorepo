import { BlockCollection, Blocks, Elements } from "slack-block-builder";

import { createSlackLink } from "~backend/src/slack/md/utils";
import { pluralize } from "~shared/text/pluralize";

import { NotificationMessage } from "../sendNotification";

export function createRequestIsDueIn3Hours({
  taskCreatorName,
  topicId,
  topicName,
  topicURL,
}: {
  topicId: string;
  topicName: string;
  topicURL: string;
  taskCreatorName: string;
}): Partial<NotificationMessage> {
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

export function createRequestIsDue({
  topicId,
  topicName,
  topicURL,
  openTasks,
}: {
  topicId: string;
  topicName: string;
  topicURL: string;
  openTasks: number;
}): Partial<NotificationMessage> {
  const message = `We noticed the request you created in ${topicName} is now overdue and there ${pluralize(
    openTasks,
    "is",
    "are"
  )} still ${openTasks} ${pluralize(openTasks, "task", "tasks")} that ${pluralize(
    openTasks,
    "has",
    "have"
  )} not been completed. You can extend the deadline or follow up`;
  const messageSlack = `${message} ${createSlackLink(topicURL, "here")}.`;
  const messageHtml = `${message} <a href="${topicURL}">${topicName}</a>.`;
  return {
    email: {
      subject: `Your request has overdue tasks in ${topicName}.`,
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
