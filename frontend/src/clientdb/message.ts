import gql from "graphql-tag";
import { observable } from "mobx";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { MessageFragment } from "~gql";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";

import { attachmentEntity } from "./attachment";
import { lastSeenMessageEntity } from "./lastSeenMessage";
import { messageReactionEntity } from "./messageReaction";
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
}).addConnections((message, { getEntity, getContextValue }) => {
  const currentUserId = getContextValue(userIdContext);

  const tasks = getEntity(taskEntity).query({ message_id: message.id });

  const lastUnreadInTheSameTopic = currentUserId
    ? getEntity(lastSeenMessageEntity).query({
        topic_id: message.topic_id,
        user_id: currentUserId,
      })
    : null;

  const connections = {
    get topic() {
      return getEntity(topicEntity).findById(message.topic_id);
    },
    get user() {
      return getEntity(userEntity).assertFindById(message.user_id);
    },
    tasks,
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
  };

  return connections;
});

export type MessageEntity = EntityByDefinition<typeof messageEntity>;
