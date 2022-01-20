import { JSONContent } from "@tiptap/react";
import gql from "graphql-tag";
import { memoize } from "lodash";
import { observable } from "mobx";

import { EntityByDefinition, cachedComputed, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { decisionOptionEntity } from "@aca/frontend/clientdb/decisionOption";
import { updateMessageTasks } from "@aca/frontend/message/updateMessageTasks";
import {
  MessageFragment,
  Message_Bool_Exp,
  Message_Constraint,
  Message_Insert_Input,
  Message_Set_Input,
} from "@aca/gql";
import { convertMessageContentToPlainText } from "@aca/richEditor/content/plainText";
import { getPerUserRequestMentionDataFromContent } from "@aca/shared/editor/mentions";

import { attachmentEntity } from "./attachment";
import { messageReactionEntity } from "./messageReaction";
import { messageTaskDueDateEntity } from "./messageTaskDueDate";
import { taskEntity } from "./task";
import { topicEntity } from "./topic";
import { userEntity } from "./user";

const messageFragment = gql`
  fragment Message on message {
    id
    content
    updated_at
    created_at
    replied_to_message_id
    topic_id
    type
    user_id
    is_first_completion_enough
  }
`;

type MessageConstraints = {
  key: Message_Constraint;
  insert: Message_Insert_Input;
  update: Message_Set_Input;
  where: Message_Bool_Exp;
};

export const messageEntity = defineEntity<MessageFragment>({
  name: "message",
  keyField: "id",
  updatedAtField: "updated_at",
  keys: getFragmentKeys<MessageFragment>(messageFragment),
  defaultSort: (message) => new Date(message.created_at).getTime(),
  getDefaultValues({ getContextValue }) {
    return {
      __typename: "message",
      user_id: getContextValue(userIdContext) ?? undefined,
      replied_to_message_id: null,
      is_first_completion_enough: false,
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<MessageFragment, MessageConstraints>(messageFragment, {
    insertColumns: ["id", "content", "replied_to_message_id", "topic_id", "type", "is_first_completion_enough"],
    updateColumns: ["content", "is_first_completion_enough"],
    upsertConstraint: "message_id_key",
    teamScopeCondition: (teamId) => ({ topic: { team_id: { _eq: teamId } } }),
  }),
  customObservableAnnotations: {
    // Content might be very nested and we dont want to observe any single change in it. We always change content as a whole.
    // We never do message.content.doc.foo.bar = 2, we always do message.content = newContent, so no nested observation needed.
    content: observable.ref,
  },
  search: {
    fields: {
      content: {
        extract(content) {
          return convertMessageContentToPlainText(content);
        },
      },
    },
  },
})
  .addConnections((message, { getEntity, getContextValue, createCache }) => {
    const currentUserId = getContextValue(userIdContext);

    const tasks = getEntity(taskEntity).query({ message_id: message.id });

    const mentionedUserIds = createCache("mentionedUserIds", () => getMentionedUserIdsInContent(message.content));

    const taskDueDate = getEntity(messageTaskDueDateEntity).query({ message_id: message.id });

    const getTasksForUser = cachedComputed((userId: string) => {
      return tasks.query({ user_id: userId });
    });

    const getIsUserParticipating = cachedComputed((userId: string) => {
      if (message.user_id === userId) return true;

      if (getTasksForUser(userId).hasItems) return true;

      if (getIsUserMentionedInContent(userId)) return true;

      return false;
    });

    const getIsUserMentionedInContent = cachedComputed((userId: string) => {
      return mentionedUserIds.get().has(userId);
    });

    const connections = {
      get topic() {
        return getEntity(topicEntity).findById(message.topic_id);
      },
      get user() {
        return getEntity(userEntity).assertFindById(message.user_id);
      },
      tasks,
      decisionOptions: getEntity(decisionOptionEntity).query({ message_id: message.id }),
      getIsUserParticipating,
      reactions: getEntity(messageReactionEntity).query({ message_id: message.id }),
      attachments: getEntity(attachmentEntity).query({ message_id: message.id }),
      get isUnread() {
        return !!connections.topic?.unreadMessages.findById(message.id);
      },
      get repliedToMessage() {
        if (!message.replied_to_message_id) return null;

        return getEntity(messageEntity).findById(message.replied_to_message_id);
      },
      get isOwn() {
        return currentUserId === message.user_id;
      },

      get isTopicMainMessage() {
        return connections.topic?.messages.first?.id === message.id;
      },

      setTasksDueDate(dueDate: Date | null) {
        const messageTaskDueDate = getEntity(messageTaskDueDateEntity);
        const previouslyStoredDueDate = messageTaskDueDate.query({ message_id: message.id }).first;

        if (!dueDate && previouslyStoredDueDate) {
          previouslyStoredDueDate.remove();
        } else if (dueDate && previouslyStoredDueDate) {
          previouslyStoredDueDate.update({
            due_at: dueDate.toISOString(),
          });
        } else if (dueDate && !previouslyStoredDueDate) {
          messageTaskDueDate.create({
            message_id: message.id,
            due_at: dueDate.toISOString(),
          });
        }
      },
      get dueDate() {
        return taskDueDate.first?.due_at ? new Date(taskDueDate.first.due_at) : null;
      },
    };

    return connections;
  })
  .addEventHandlers({
    itemAdded(message) {
      updateMessageTasks(message);
    },
    itemUpdated(message, dataBefore) {
      updateMessageTasks(message, dataBefore.content);
    },
  });

export type MessageEntity = EntityByDefinition<typeof messageEntity>;

const getMentionedUserIdsInContent = memoize(
  (content: JSONContent) => new Set(getPerUserRequestMentionDataFromContent(content).map((data) => data.userId))
);
