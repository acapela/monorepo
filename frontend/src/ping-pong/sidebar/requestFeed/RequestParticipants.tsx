import React from "emoji-mart/node_modules/@types/react";
import { uniq } from "lodash";
import { computed } from "mobx";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useDb } from "~frontend/clientdb";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";

interface Props {
  topicId: string;
}

export const RequestParticipants = function RequestParticipants({ topicId }: Props) {
  const db = useDb();
  const currentUser = useAssertCurrentUser();

  const participants = computed(() => {
    const topicOwner = db.topic.findById(topicId)?.owner_id;
    const allTasks = db.task.find((task) => task.message?.topic_id === topicId).all;

    const allUsersWithTasksAssigned = allTasks.map((task) => task.user_id);

    const allTopicParticipants = uniq([...allUsersWithTasksAssigned, topicOwner]);

    const participantsWithoutCurrentUser = allTopicParticipants.filter((userId) => userId !== currentUser.id);

    // Corner case: Your own avatar should only appear is you assigned a task to yourself and no one else
    if (participantsWithoutCurrentUser.length === 0) {
      return [db.user.findById(currentUser.id)];
    }

    return db.user.find(({ id }) => participantsWithoutCurrentUser.includes(id)).all;
  }).get();

  return (
    <span>
      {participants.map((participant) => (
        <UserAvatar user={participant} size="small" />
      ))}
    </span>
  );
};
