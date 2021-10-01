import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { createMutation, createQuery } from "~frontend/gql/utils";
import {
  MessageFragment,
  Message_Insert_Input,
  Message_Set_Input,
  PushUpdateMessageMutation,
  PushUpdateMessageMutationVariables,
  UpdatedMessagesQuery,
  UpdatedMessagesQueryVariables,
} from "~gql";

import { attachmentEntity } from "./attachment";
import { messageReactionEntity } from "./messageReaction";
import { taskEntity } from "./task";
import { topicEntity } from "./topic";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/getFragmentKeys";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";

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

const [, { mutate: updateMessage }] = createMutation<PushUpdateMessageMutation, PushUpdateMessageMutationVariables>(
  () => gql`
    ${messageFragment}
    mutation PushUpdateMessage($input: message_insert_input!) {
      insert_message_one(
        object: $input
        on_conflict: { constraint: message_id_key, update_columns: [content, type, replied_to_message_id] }
      ) {
        ...Message
      }
    }
  `
);

function convertChangedDataToInput({
  id,
  content,
  replied_to_message_id,
  topic_id,
  type,
  user_id,
}: Partial<MessageFragment>): Message_Insert_Input {
  return { id, content, replied_to_message_id, topic_id, type, user_id };
}

export const messageEntity = defineEntity<MessageFragment>({
  name: "message",
  keyField: "id",
  updatedAtField: "updated_at",
  keys: getFragmentKeys<MessageFragment>(messageFragment),
  defaultSort: (message) => new Date(message.created_at).getTime(),
  getDefaultValues() {
    return {
      __typename: "message",
      ...getGenericDefaultData(),
    };
  },
  sync: {
    pull({ lastSyncDate, updateItems }) {
      console.log("pull messages");
      return subscribeToMessageUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.message);
      });
    },
    async push(task) {
      const result = await updateMessage({ input: convertChangedDataToInput(task) });

      return result[0] ?? false;
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
    get repliedToMessage() {
      if (!message.replied_to_message_id) return null;

      return getEntity(messageEntity).findById(message.replied_to_message_id);
    },
    get attachments() {
      return getEntity(attachmentEntity).query((attachment) => attachment.message_id === message.id);
    },
    get isOwnMessage() {
      // TODOC
      return true;
    },
  };
});

export type MessageEntity = EntityByDefinition<typeof messageEntity>;
