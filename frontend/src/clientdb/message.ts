import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { MessageFragment, UpdatedMessagesQuery, UpdatedMessagesQueryVariables } from "~frontend/../../gql";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
import { attachmentEntity } from "./attachment";
import { topicEntity } from "./topic";
import { userEntity } from "./user";
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
      pull({ lastSyncDate, updateItems }) {
        return subscribeToMessageUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.message);
        });
      },
    },
  },
  (message, { getEntity }) => {
    return {
      get topic() {
        return getEntity(topicEntity).findById(message.topic_id);
      },
      get user() {
        return getEntity(userEntity).findById(message.user_id);
      },
      // get repliedToMessage() {
      //   if (!message.replied_to_message_id) return null;

      //   return getEntity(message.findById(message.replied_to_message_id);
      // },
      get attachments() {
        return getEntity(attachmentEntity).query((attachment) => attachment.message_id === message.id);
      },
    };
  }
);
