import { NotificationEntity } from "@aca/desktop/clientdb/notification";

import { DefinedList, defineList } from "./defineList";

function getIsNotificationNotResolved(notification: NotificationEntity) {
  if (notification.resolved_at !== null) return false;
  if (!notification.inner) return false;

  return true;
}

export const inboxList = defineList({
  id: "inbox",
  name: "Inbox",
  filter: getIsNotificationNotResolved,
});

export const slackList = defineList({
  id: "slack",
  name: "Slack",
  filter: (notification) => {
    return notification.kind === "notification_slack_message" && getIsNotificationNotResolved(notification);
  },
});

export const notionList = defineList({
  id: "notion",
  name: "Notion",
  filter: (notification) => {
    return notification.kind === "notification_notion" && getIsNotificationNotResolved(notification);
  },
});

export const figmaList = defineList({
  id: "figma",
  name: "Figma",
  filter: (notification) => {
    return notification.kind === "notification_figma_comment" && getIsNotificationNotResolved(notification);
  },
});

export const preconfiguredLists = [inboxList, slackList, notionList, figmaList];

export const preconfiguredListIdMap = {
  inbox: inboxList,
  slack: slackList,
  notion: notionList,
  figma: figmaList,
};

export function getPredefinedListById(id: string): DefinedList | null {
  return preconfiguredListIdMap[id as keyof typeof preconfiguredListIdMap] ?? null;
}
