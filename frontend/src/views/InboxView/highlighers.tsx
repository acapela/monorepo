import { differenceInHours } from "date-fns";
import React from "react";
import styled from "styled-components";

import { cachedComputed } from "~clientdb";
import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";
import { IconBell, IconComment, IconDot } from "~ui/icons";

const checkDueWithinNextDay = (task: TaskEntity) =>
  task.dueDate ? differenceInHours(task.dueDate, new Date()) <= 24 : false;

const UIIconDot = styled(IconDot)`
  color: #1a91ff;
`;

const UIIconBell = styled(IconBell)`
  color: #ffb85c;
`;

const UIIconComment = styled(IconComment)`
  color: #9ca3af;
`;

const getSelfAssignedUnseenTask = cachedComputed(
  (topic: TopicEntity) => topic.selfAssignedOpenTasks.query((task) => !task.seen_at).first
);

const getSelfAssignedTaskDueSoon = cachedComputed(
  (topic: TopicEntity) => topic.selfAssignedOpenTasks.query((task) => checkDueWithinNextDay(task)).first
);

export const highlighters: {
  icon: React.ReactNode;
  check: (topic: TopicEntity) => boolean | TaskEntity;
}[] = [
  {
    icon: <UIIconDot />,
    check: (topic) => getSelfAssignedUnseenTask(topic) ?? false,
  },
  {
    icon: <UIIconBell />,
    check: (topic) => getSelfAssignedTaskDueSoon(topic) ?? false,
  },
  {
    icon: <UIIconComment />,
    check: (topic) => topic.unreadMessages.count > 0,
  },
];
