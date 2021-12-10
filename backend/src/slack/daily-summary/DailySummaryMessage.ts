import { min, sortBy } from "lodash";
import { Blocks, Elements, Md, Message } from "slack-block-builder";

import { SlackNotificationQueue } from "~db";

import { mdDate } from "../md/utils";
import { SlackActionIds } from "../utils";
import { TopicVM } from "./types";

interface DailySummaryMessageProps {
  topicsDueToday: TopicVM[];
  otherReceivedTopics: TopicVM[];
  notificationsSentOutsideOfWorkHours: SlackNotificationQueue[];
}

const MAX_ALLOWED_ELEMENTS = 100;

function getEarliestDueDate(topic: TopicVM) {
  return min(topic.message.map((m) => m.message_task_due_date?.due_at));
}

// Look at dailyMessageNotification for whole flow explanation
export function DailySummaryMessage({
  topicsDueToday,
  otherReceivedTopics,
  notificationsSentOutsideOfWorkHours,
}: DailySummaryMessageProps) {
  const blocks = [
    Blocks.Context({}).elements(["Daily Acapela Summary"]),
    ...TasksDueSoon(topicsDueToday),
    ...TasksInputStillNeeded(otherReceivedTopics),
    ...Notifications(notificationsSentOutsideOfWorkHours),
  ];
  return Message()
    .blocks(
      blocks.slice(0, MAX_ALLOWED_ELEMENTS),
      ...(blocks.length > MAX_ALLOWED_ELEMENTS
        ? [Blocks.Section({ text: `...and ${MAX_ALLOWED_ELEMENTS - blocks.length} others` })]
        : [])
    )
    .buildToObject();
}

function TasksDueSoon(topicsDueToday: TopicVM[]) {
  if (topicsDueToday.length === 0) {
    return [];
  }

  const Header = [Blocks.Header({ text: "🔥 Requires Attention" }), Blocks.Divider()];

  const sortedTopics = sortBy(topicsDueToday, getEarliestDueDate);

  return Header.concat(
    sortedTopics.map((topic) => {
      const earliestDueDate = getEarliestDueDate(topic);
      return Blocks.Section({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        text: `${Md.bold(topic.name)}\nDue at ${mdDate(earliestDueDate!, "time")}`,
      }).accessory(
        Elements.Button({
          actionId: SlackActionIds.OpenViewRequestModal,
          value: topic.id,
          text: "View",
        })
      );
    })
  );
}

function TasksInputStillNeeded(otherReceivedTopics: TopicVM[]) {
  if (otherReceivedTopics.length === 0) {
    return [];
  }

  const Header = [Blocks.Header({ text: "👀 Your input is still needed" }), Blocks.Divider()];

  const sortedTopics = sortBy(otherReceivedTopics, getEarliestDueDate);

  return Header.concat(
    sortedTopics.map((topic) => {
      const earliestDueDate = getEarliestDueDate(topic);
      const subTitle = earliestDueDate
        ? `Due ${mdDate(earliestDueDate)}`
        : `From ${Md.italic(topic.user?.name ?? "teammate")}`;
      return Blocks.Section({
        text: `${Md.bold(topic.name)}\n${subTitle}`,
      }).accessory(
        Elements.Button({
          actionId: SlackActionIds.OpenViewRequestModal,
          value: topic.id,
          text: "View",
        })
      );
    })
  );
}

function Notifications(notificationsSentOutsideOfWorkHours: SlackNotificationQueue[]) {
  if (notificationsSentOutsideOfWorkHours.length === 0) {
    return [];
  }

  const Header = [Blocks.Header({ text: "🌙  While you were away..." }), Blocks.Divider()];

  return Header.concat(
    notificationsSentOutsideOfWorkHours.map((notification) => {
      return Blocks.Section({
        text: notification.payload + "\n",
      });
    })
  );
}
