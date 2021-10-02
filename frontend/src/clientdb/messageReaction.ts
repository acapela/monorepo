import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { createMutation, createQuery } from "~frontend/gql/utils";
import {
  MessageReactionFragment,
  Message_Reaction_Insert_Input,
  Message_Reaction_Set_Input,
  PushUpdateMessageReactionMutation,
  PushUpdateMessageReactionMutationVariables,
  UpdatedMessageReactionsQuery,
  UpdatedMessageReactionsQueryVariables,
} from "~gql";

import { messageEntity } from "./message";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/getFragmentKeys";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";

const messageReactionFragment = gql`
  fragment MessageReaction on message_reaction {
    id
    message_id
    user_id
    emoji
    updated_at
  }
`;

const [, { subscribe: subscribeToMessageUpdates }] = createQuery<
  UpdatedMessageReactionsQuery,
  UpdatedMessageReactionsQueryVariables
>(
  () => gql`
    ${messageReactionFragment}

    query UpdatedMessageReactions($lastSyncDate: timestamptz) {
      message_reaction(where: { updated_at: { _gt: $lastSyncDate } }) {
        ...MessageReaction
      }
    }
  `
);

const [, { mutate: updateMessageReaction }] = createMutation<
  PushUpdateMessageReactionMutation,
  PushUpdateMessageReactionMutationVariables
>(
  () => gql`
    ${messageReactionFragment}
    mutation PushUpdateMessageReaction($input: message_reaction_insert_input!) {
      insert_message_reaction_one(
        object: $input
        on_conflict: { constraint: message_reaction_id_key, update_columns: [emoji] }
      ) {
        ...MessageReaction
      }
    }
  `
);

function convertChangedDataToInput({
  emoji,
  user_id,
  message_id,
}: Partial<MessageReactionFragment>): Message_Reaction_Insert_Input {
  return { emoji, user_id, message_id };
}

export const messageReactionEntity = defineEntity<MessageReactionFragment>({
  name: "messageReaction",
  keyField: "id",
  updatedAtField: "updated_at",
  keys: getFragmentKeys<MessageReactionFragment>(messageReactionFragment),
  getDefaultValues() {
    return {
      __typename: "message_reaction",
      ...getGenericDefaultData(),
    };
  },
  sync: {
    pullUpdated({ lastSyncDate, updateItems }) {
      return subscribeToMessageUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.message_reaction);
      });
    },
    async push(task) {
      const result = await updateMessageReaction({ input: convertChangedDataToInput(task) });

      return result[0] ?? false;
    },
  },
}).addConnections((message, { getEntity }) => {
  return {
    get message() {
      return getEntity(messageEntity).findById(message.message_id);
    },
    get user() {
      return getEntity(userEntity).findById(message.user_id);
    },
    get isOwn() {
      // TODOC
      return false;
    },
  };
});

export type MessageReactionEntity = EntityByDefinition<typeof messageReactionEntity>;
