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
  const messageSlack = `You have three hours left to complete your task in ${topicName}. It's getting tight 😅! If that's too soon, click ${createSlackLink(
    topicURL,
    "here"
  )} to let ${taskCreatorName} know you need more time ⏰.`;
  const messageHtml = `You have three hours left to complete your task in ${topicName}. It's getting tight 😅! If that's too soon, click <a href="${topicURL}">here</a> to let ${taskCreatorName} know you need more time ⏰.`;
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
  const message = `The request you sent (${topicName}) still has ${openTasks} outstanding ${pluralize(
    openTasks,
    "task",
    "tasks"
  )} left. Bummer 😭. Don't worry though, we've let your team know they're overdue 🤓. If you want to extend the deadline or follow-up with them personally, click`;
  const messageSlack = `${message} ${createSlackLink(topicURL, "here")}.`;
  const messageHtml = `${message} <a href="${topicURL}">here</a>.`;
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

export function createShortDueDate({
  taskCreatorName,
  topicId,
  topicName,
  topicURL,
  deadline,
}: {
  topicId: string;
  topicName: string;
  topicURL: string;
  taskCreatorName: string;
  deadline: string;
}): Partial<NotificationMessage> {
  const message = `A new deadline has been added to a task in ${topicName} 📆. The new deadline is ${deadline}. If that's not going to work, let ${taskCreatorName} know.`;
  const messageSlack = `${message} ${createSlackLink(topicURL, "here")}`;
  const messageHtml = `${message} <a href="${topicURL}">here</a>`;
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