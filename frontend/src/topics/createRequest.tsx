import { action, runInAction } from "mobx";

import { ClientDb } from "~frontend/clientdb";
import { TopicEntity } from "~frontend/clientdb/topic";
import { EditorAttachmentInfo } from "~frontend/message/composer/attachments";
import { createMessageAndAttachMeta } from "~frontend/message/createNewMessage";
import { DecisionOptionDraft, createDecisionsForMessage } from "~frontend/message/decisions";
import { updateMessageAttachments } from "~frontend/message/updateAttachments";
import { TopicFragment } from "~gql";
import { RichEditorNode } from "~richEditor/content/types";
import { runUntracked } from "~shared/mobxUtils";
import { getTopicNameFromContent } from "~shared/routes/topicSlug";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";

async function getAvailableSlugForTopicName(db: ClientDb, topicName: string) {
  const optimisticSlug = await slugify(topicName);

  return runUntracked(() => {
    if (!db.topic.findByUniqueIndex("slug", optimisticSlug)) {
      return optimisticSlug;
    }
    let suffixIndex = 2;

    while (db.topic.findByUniqueIndex("slug", `${optimisticSlug}-${suffixIndex}`)) {
      suffixIndex++;
    }

    return `${optimisticSlug}-${suffixIndex}`;
  });
}

export interface NewRequestProps {
  topicToDuplicate?: TopicEntity;
  onTopicCreated?: (newTopic: TopicEntity) => void;
  alwaysExpanded?: boolean;
}

interface CreateNewRequestInput {
  db: ClientDb;
  name?: string;
  content: RichEditorNode;
  id?: string;
  priority?: TopicFragment["priority"];
  tasksDueDate?: Date;
  attachmentsDrafts?: EditorAttachmentInfo[];
  decisionOptionsDrafts?: DecisionOptionDraft[];
}
/**
 * This is central place creating new requests
 */
export const createNewRequest = action(
  async ({
    name,
    content,
    db,
    id = getUUID(),
    priority,
    tasksDueDate,
    attachmentsDrafts,
    decisionOptionsDrafts,
  }: CreateNewRequestInput) => {
    let finalTitle = name;

    if (!finalTitle?.trim().length) {
      finalTitle = getTopicNameFromContent(content) ?? "New topic";
    }

    const topicNameSlug = await getAvailableSlugForTopicName(db, finalTitle);

    const createdEntities = runInAction(() => {
      const topic = db.topic.create({ id, name: finalTitle, slug: topicNameSlug, priority });

      const message = createMessageAndAttachMeta({
        topic,
        content,
        type: "TEXT",
        decisionOptions: decisionOptionsDrafts,
        attachments: attachmentsDrafts,
      });

      if (tasksDueDate) {
        message.setTasksDueDate(tasksDueDate);
      }

      return {
        topic,
        message,
      };
    });

    return createdEntities;
  }
);
