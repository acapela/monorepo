import { action, runInAction } from "mobx";

import { ClientDb } from "~frontend/clientdb";
import { AttachmentEntity } from "~frontend/clientdb/attachment";
import { TopicEntity } from "~frontend/clientdb/topic";
import { EditorAttachmentInfo } from "~frontend/message/composer/attachments";
import { DecisionOptionDraft, createDecisionsForMessage } from "~frontend/message/decisions";
import { updateMessageTasks } from "~frontend/message/updateMessageTasks";
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
      const message = db.message.create({ content, topic_id: topic.id, type: "TEXT" });

      const tasks = updateMessageTasks(db, message);

      if (tasksDueDate) {
        message.setTasksDueDate(tasksDueDate);
      }

      const attachments: AttachmentEntity[] = [];

      attachmentsDrafts?.forEach((attachmentDraft) => {
        const attachment = db.attachment.update(attachmentDraft.uuid, { message_id: message.id });
        attachments.push(attachment);
      });

      const decisionOptions = createDecisionsForMessage(db, message, decisionOptionsDrafts ?? []);

      return {
        topic,
        message,
        tasks,
        attachments,
        decisionOptions,
      };
    });

    return createdEntities;
  }
);
