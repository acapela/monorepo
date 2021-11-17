import { JSONContent } from "@tiptap/react";
import { action } from "mobx";

import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { getUniqueRequestMentionDataFromContent } from "~shared/editor/mentions";

const extractUserIdsWithRequestType = (content: JSONContent) =>
  Object.fromEntries(getUniqueRequestMentionDataFromContent(content).map(({ userId, type }) => [userId, type]));

export function useUpdateMessageTasks() {
  const db = useDb();

  return action(function updateMessageTasks(message: MessageEntity, contentBefore: JSONContent | null = null) {
    const oldRequests = contentBefore ? extractUserIdsWithRequestType(contentBefore) : {};
    const newRequests = extractUserIdsWithRequestType(message.content);

    for (const [userId, type] of Object.entries(oldRequests)) {
      if (newRequests[userId] !== type) {
        db.task.query({ message_id: message.id, user_id: userId, type }).first?.remove();
      }
    }

    for (const [userId, type] of Object.entries(newRequests)) {
      if (oldRequests[userId] !== type) {
        db.task.create({ message_id: message.id, user_id: userId, type });
      }
    }
  });
}
