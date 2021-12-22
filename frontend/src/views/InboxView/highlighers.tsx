import { differenceInHours } from "date-fns";
import React from "react";

import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";
import { IconBell, IconComment, IconDot } from "~ui/icons";

const checkDueWithinNextDay = (task: TaskEntity) =>
  task.dueDate ? differenceInHours(task.dueDate, new Date()) <= 24 : false;

export const highlighters: {
  icon: React.ReactNode;
  check: (topic: TopicEntity) => boolean | TaskEntity;
}[] = [
  {
    icon: <IconDot />,
    check: (topic) => topic.openSelfAssignedTasks.query((task) => !task.seen_at).first ?? false,
  },
  {
    icon: <IconBell />,
    check: (topic) => topic.openSelfAssignedTasks.query(checkDueWithinNextDay).first ?? false,
  },
  {
    icon: <IconComment />,
    check: (topic) => topic.unreadMessages.count > 0,
  },
];
