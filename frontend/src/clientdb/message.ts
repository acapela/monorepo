import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { MessageFragment, UpdatedMessagesQuery, UpdatedMessagesQueryVariables } from "~frontend/../../gql";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
import { getType } from "./utils";

const messageFragment = gql`
  fragment Message on message {
    id
    content
    created_at
    replied_to_message_id
    topic_id
    transcription_id
    type
    user_id
  }
`;

const [, { subscribe: subscribeToMessageUpdates }] = createQuery<UpdatedMessagesQuery, UpdatedMessagesQueryVariables>(
  () => gql`
    ${messageFragment}

    query UpdatedMessages($lastSyncDate: timestamptz) {
      message(where: { created_at: { _gte: $lastSyncDate } }) {
        ...Message
      }
    }
  `
);

export const messageEntity = defineEntity(
  {
    type: getType<MessageFragment>(),
    name: "message",
    getCacheKey: (space) => space.id,
    sync: {
      runSync({ lastSyncDate, updateItems }) {
        return subscribeToMessageUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.message);
        });
      },
    },
  },
  (message) => {
    return {
      get topic() {
        return clientdb.topic.findById(message.topic_id);
      },
      get user() {
        return clientdb.user.findById(message.user_id);
      },
      // get repliedToMessage() {
      //   if (!message.replied_to_message_id) return null;

      //   return clientdb.message.findById(message.replied_to_message_id);
      // },
      get attachments() {
        return clientdb.attachment.query((attachment) => attachment.message_id === message.id);
      },
    };
  }
);
