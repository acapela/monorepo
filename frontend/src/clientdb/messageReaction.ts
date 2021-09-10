import gql from "graphql-tag";

import { EntityByDefinition } from "~frontend/../../clientdb/entity/entity";
import {
  MessageReactionFragment,
  UpdatedMessageReactionsQuery,
  UpdatedMessageReactionsQueryVariables,
} from "~frontend/../../gql";
import { defineEntity } from "~clientdb";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";

import { messageEntity } from "./message";
import { userEntity } from "./user";

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

export const messageReactionEntity = defineEntity<MessageReactionFragment>({
  name: "messageReaction",
  keyField: "id",
  updatedAtField: "updated_at",
  sync: {
    initPromise: () => renderedApolloClientPromise,
    pull({ lastSyncDate, updateItems }) {
      console.log("pull messages");
      return subscribeToMessageUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.message_reaction);
      });
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
