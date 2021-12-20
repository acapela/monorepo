import { action, runInAction } from "mobx";

import { DatabaseLinker } from "~clientdb/entity/entitiesConnections";
import { TopicEntity, topicEntity } from "~frontend/clientdb/topic";
import { EditorAttachmentInfo } from "~frontend/message/composer/attachments";
import { createMessageAndAttachMeta } from "~frontend/message/createNewMessage";
import { DecisionOptionDraft } from "~frontend/message/decisions";
import { TopicFragment } from "~gql";
import { RichEditorNode } from "~richEditor/content/types";
import { runUntracked } from "~shared/mobxUtils";
import { getTopicNameFromContent } from "~shared/routes/topicSlug";
import { slugify } from "~shared/slugify";
import { getUUID } from "~shared/uuid";

async function getAvailableSlugForTopicName(db: DatabaseLinker, topicName: string) {
  const optimisticSlug = await slugify(topicName);

  const topicClient = db.getEntity(topicEntity);

  return runUntracked(() => {
    if (!topicClient.findByUniqueIndex("slug", optimisticSlug)) {
      return optimisticSlug;
    }
    let suffixIndex = 2;

    while (topicClient.findByUniqueIndex("slug", `${optimisticSlug}-${suffixIndex}`)) {
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
  db: DatabaseLinker;
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

    const topicClient = db.getEntity(topicEntity);

    const topicNameSlug = await getAvailableSlugForTopicName(db, finalTitle);

    const createdEntities = runInAction(() => {
      const topic = topicClient.create({ id, name: finalTitle, slug: topicNameSlug, priority });

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
