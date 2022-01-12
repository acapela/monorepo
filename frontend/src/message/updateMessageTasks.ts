import { JSONContent } from "@tiptap/react";
import { action } from "mobx";

import { MessageEntity } from "@aca/frontend/clientdb/message";
import { taskEntity } from "@aca/frontend/clientdb/task";
import { getArrayIncludesEqual } from "@aca/shared/array";
import { getPerUserRequestMentionDataFromContent } from "@aca/shared/editor/mentions";

export const updateMessageTasks = action(function updateMessageTasks(
  message: MessageEntity,
  contentBefore: JSONContent | null = null
): boolean {
  const oldRequests = contentBefore ? getPerUserRequestMentionDataFromContent(contentBefore) : [];
  const newRequests = getPerUserRequestMentionDataFromContent(message.content);

  const tasksToRemove = oldRequests.filter((oldRequest) => !getArrayIncludesEqual(newRequests, oldRequest));
  const tasksToAdd = newRequests.filter((oldRequest) => !getArrayIncludesEqual(oldRequests, oldRequest));

  // There is no need to change anything
  if (tasksToRemove.length === 0 && tasksToAdd.length === 0) {
    return false;
  }

  const taskEntityClient = message.db.getEntity(taskEntity);

  for (const taskToRemove of tasksToRemove) {
    taskEntityClient
      .query({ message_id: message.id, user_id: taskToRemove.userId, type: taskToRemove.type })
      .first?.remove();
  }

  for (const taskToAdd of tasksToAdd) {
    taskEntityClient.create({ message_id: message.id, user_id: taskToAdd.userId, type: taskToAdd.type });
  }

  return true;
});
