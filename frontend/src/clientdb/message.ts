import { JSONContent } from "@tiptap/react";
import gql from "graphql-tag";
import { memoize, uniq } from "lodash";
import { observable } from "mobx";

import { EntityByDefinition, cachedComputed, defineEntity } from "~clientdb";
import { MessageFragment } from "~gql";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { getMentionNodesFromContent } from "~shared/editor/mentions";

import { attachmentEntity } from "./attachment";
import { lastSeenMessageEntity } from "./lastSeenMessage";
import { messageReactionEntity } from "./messageReaction";
import { messageTaskDueDateEntity } from "./messageTaskDueDate";
import { taskEntity } from "./task";
import { topicEntity } from "./topic";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { userIdContext } from "./utils/context";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

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
  }
`;

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
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<MessageFragment>(messageFragment, {
    insertColumns: ["id", "content", "replied_to_message_id", "topic_id", "type"],
    updateColumns: ["content"],
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
}).addConnections((message, { getEntity, getContextValue, createCache }) => {
  const currentUserId = getContextValue(userIdContext);

  const tasks = getEntity(taskEntity).query({ message_id: message.id });

  const mentionedUserIds = createCache("mentionedUserIds", () => getMentionedUserIdsInContent(message.content));

  const lastUnreadInTheSameTopic = currentUserId
    ? getEntity(lastSeenMessageEntity).query({
        topic_id: message.topic_id,
        user_id: currentUserId,
      })
    : null;

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
    return mentionedUserIds.get().includes(userId);
  });

  const connections = {
    get topic() {
      return getEntity(topicEntity).findById(message.topic_id);
    },
    get user() {
      return getEntity(userEntity).assertFindById(message.user_id);
    },
    tasks,
    getIsUserParticipating,
    reactions: getEntity(messageReactionEntity).query({ message_id: message.id }),
    attachments: getEntity(attachmentEntity).query({ message_id: message.id }),
    get isUnread() {
      if (!currentUserId || message.user_id == currentUserId) return false;

      const lastUnreadMessage = lastUnreadInTheSameTopic?.first;

      if (!lastUnreadMessage) return true;

      // This very message is last unread one
      if (lastUnreadMessage.id === message.id) return true;

      return new Date(message.updated_at) >= lastUnreadMessage.getUpdatedAt();
    },
    get repliedToMessage() {
      if (!message.replied_to_message_id) return null;

      return getEntity(messageEntity).findById(message.replied_to_message_id);
    },
    get isOwn() {
      return currentUserId === message.user_id;
    },

    get dueDate() {
      const taskDueDate = getEntity(messageTaskDueDateEntity).query({ message_id: message.id });
      return taskDueDate.first?.due_date ? new Date(taskDueDate.first.due_date) : null;
    },

    set dueDate(dueDate: Date | null) {
      const messageTaskDueDateClient = getEntity(messageTaskDueDateEntity);
      const previouslyStoredDueDate = messageTaskDueDateClient.query({ message_id: message.id }).first;

      if (!dueDate && previouslyStoredDueDate) {
        previouslyStoredDueDate.remove();
      } else if (dueDate) {
        messageTaskDueDateClient.createOrUpdate({
          id: previouslyStoredDueDate?.id,
          message_id: message.id,
          due_date: dueDate.toISOString(),
        });
      }
    },
  };

  return connections;
});

export type MessageEntity = EntityByDefinition<typeof messageEntity>;

const getMentionedUserIdsInContent = memoize((content: JSONContent) => {
  return uniq(getMentionNodesFromContent(content).map((node) => node.attrs.data.userId));
});
