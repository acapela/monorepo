import gql from "graphql-tag";
import { observable } from "mobx";

import { convertMessageContentToPlainText } from "~frontend/../../richEditor/content/plainText";
import { EntityByDefinition, defineEntity } from "~clientdb";
import { MessageFragment } from "~gql";

import { attachmentEntity } from "./attachment";
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
  return {
    get topic() {
      return getEntity(topicEntity).findById(message.topic_id);
    },
    get user() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return getEntity(userEntity).findById(message.user_id)!;
    },
    tasks: getEntity(taskEntity).query({ message_id: message.id }),
    reactions: getEntity(messageReactionEntity).query({ message_id: message.id }),
    attachments: getEntity(attachmentEntity).query({ message_id: message.id }),
    get repliedToMessage() {
      if (!message.replied_to_message_id) return null;

      return getEntity(messageEntity).findById(message.replied_to_message_id);
    },
    get isOwnMessage() {
      return getContextValue(userIdContext) === message.user_id;
    },
  };
});

export type MessageEntity = EntityByDefinition<typeof messageEntity>;
