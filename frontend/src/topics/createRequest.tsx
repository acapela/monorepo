import { action, runInAction } from "mobx";

import { DatabaseLinker } from "@aca/clientdb/entity/entitiesConnections";
import { TopicEntity, topicEntity } from "@aca/frontend/clientdb/topic";
import { EditorAttachmentInfo } from "@aca/frontend/message/composer/attachments";
import { createMessageAndAttachMeta } from "@aca/frontend/message/createNewMessage";
import { DecisionOptionDraft } from "@aca/frontend/message/decisions";
import { TopicFragment } from "@aca/gql";
import { RichEditorNode } from "@aca/richEditor/content/types";
import { runUntracked } from "@aca/shared/mobx/utils";
import { getTopicNameFromContent } from "@aca/shared/routes/topicSlug";
import { slugify } from "@aca/shared/slugify";
import { getUUID } from "@aca/shared/uuid";

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
  isFirstCompletionEnough: boolean;
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
    isFirstCompletionEnough,
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
        isFirstCompletionEnough,
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
