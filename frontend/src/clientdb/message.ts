import gql from "graphql-tag";

import { EntityByDefinition } from "~frontend/../../clientdb/entity/entity";
import { MessageFragment, UpdatedMessagesQuery, UpdatedMessagesQueryVariables } from "~frontend/../../gql";
import { defineEntity } from "~clientdb";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";

import { attachmentEntity } from "./attachment";
import { messageReactionEntity } from "./messageReaction";
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
  }
`;

const [, { subscribe: subscribeToMessageUpdates }] = createQuery<UpdatedMessagesQuery, UpdatedMessagesQueryVariables>(
  () => gql`
    ${messageFragment}

    query UpdatedMessages($lastSyncDate: timestamptz) {
      message(where: { created_at: { _gt: $lastSyncDate } }) {
        ...Message
      }
    }
  `
);

export const messageEntity = defineEntity<MessageFragment>({
  name: "message",
  keyField: "id",
  updatedAtField: "updated_at",
  sync: {
    initPromise: () => renderedApolloClientPromise,
    pull({ lastSyncDate, updateItems }) {
      console.log("pull messages");
      return subscribeToMessageUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.message);
      });
    },
  },
}).addConnections((message, { getEntity }) => {
  return {
    get topic() {
      return getEntity(topicEntity).findById(message.topic_id);
    },
    get user() {
      return getEntity(userEntity).findById(message.user_id);
    },
    get tasks() {
      return getEntity(taskEntity).query((task) => task.message_id === message.id);
    },
    get reactions() {
      return getEntity(messageReactionEntity).query((reaction) => reaction.message_id === message.id);
    },
    // get repliedToMessage() {
    //   if (!message.replied_to_message_id) return null;

    //   return getEntity(message.findById(message.replied_to_message_id);
    // },
    get attachments() {
      return getEntity(attachmentEntity).query((attachment) => attachment.message_id === message.id);
    },
    get isOwnMessage() {
      // TODOC
      return false;
    },
  };
});

export type MessageEntity = EntityByDefinition<typeof messageEntity>;
