import React, { ReactNode } from "react";

import { createTypeGuard } from "@aca/shared/typeUtils/typeGuard";
import { getUUID } from "@aca/shared/uuid";
import {
  IconAt,
  IconBell,
  IconBookOpen,
  IconBookQueue,
  IconComment,
  IconCrosshair,
  IconHashtagCircle,
  IconLoader,
  IconSend2,
  IconShare,
  IconTarget,
  IconUserAlert,
  IconUsers,
} from "@aca/ui/icons";

interface TagConfig {
  color: string;
  icon: ReactNode;
  label: string;
  tooltip?: string;
  hideLabel?: boolean;
}

export function getTagConfig(tag: NotificationTag): TagConfig {
  const categoryConfig = tagCategoryConfigMap[tag.category];

  return {
    ...categoryConfig,
    label: tag.customLabel ? tag.customLabel : categoryConfig.label,
  };
}

const colorsMap = {
  impactful: "#E8304F",
  contextInfo: "#7878F4",
  secondary: "#0A9964",
  actionNeeded: "#DCDE78",
  tertiary: "#8888",
};

const tagCategoryConfigMap = createTypeGuard<Record<string, TagConfig>>()({
  mention: {
    color: colorsMap.impactful,
    icon: <IconAt />,
    label: "Mention",
  },
  directMessage: {
    color: colorsMap.impactful,
    icon: <IconUsers />,
    label: "DM",
    tooltip: "Direct messages & Groups",
  },
  comment: {
    color: colorsMap.secondary,
    icon: <IconComment />,
    label: "Comment",
  },
  update: {
    color: colorsMap.secondary,
    icon: <IconLoader />,
    label: "Update",
  },
  assigned: {
    color: colorsMap.impactful,
    icon: <IconUserAlert />,
    label: "Assigned",
  },
  space: {
    color: colorsMap.contextInfo,
    icon: <IconTarget />,
    label: "Document",
  },
  channel: {
    color: colorsMap.contextInfo,
    icon: <IconHashtagCircle />,
    label: "Channel",
  },
  thread: {
    color: colorsMap.tertiary,
    icon: <IconBookQueue />,
    label: "Thread",
    hideLabel: true,
  },
  reminder: {
    color: colorsMap.impactful,
    icon: <IconBell />,
    label: "Reminder",
  },
  pr: {
    color: colorsMap.actionNeeded,
    icon: <IconShare />,
    label: "PR",
  },
  email: {
    color: colorsMap.secondary,
    icon: <IconSend2 />,
    label: "Email",
  },
  workspace: {
    color: colorsMap.contextInfo,
    icon: <IconCrosshair />,
    label: "Workspace",
  },
  read: {
    color: colorsMap.contextInfo,
    icon: <IconBookOpen />,
    label: "Read",
  },
});

export type NotificationTagCategory = keyof typeof tagCategoryConfigMap;

export interface NotificationTag {
  id: string;
  kind: "notificationTag";
  category: NotificationTagCategory;
  customLabel?: string;
}

export type NotificationTagInput = NotificationTagCategory | Omit<NotificationTag, "kind" | "id">;

const tagCache = new Map<string, NotificationTag>();

function getTagInputCacheKey(input: NotificationTagInput) {
  if (typeof input === "string") {
    return input;
  }

  if (input.customLabel && input.customLabel !== "") {
    return `${input.category}.${input.customLabel}`;
  }

  return input.category;
}

function createNotificationTag(input: NotificationTagInput): NotificationTag {
  if (typeof input === "string") {
    return { id: getUUID(), kind: "notificationTag", category: input };
  }

  return {
    id: getUUID(),
    kind: "notificationTag",
    ...input,
  };
}

export function getNotificationTag(input: NotificationTagInput): NotificationTag {
  const cacheKey = getTagInputCacheKey(input);

  const existingTag = tagCache.get(cacheKey);

  if (existingTag) {
    return existingTag;
  }

  const newTag = createNotificationTag(input);

  tagCache.set(cacheKey, newTag);

  return newTag;
}
