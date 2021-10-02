import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { MessageReactionFragment } from "~gql";

import { messageEntity } from "./message";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/getFragmentKeys";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const messageReactionFragment = gql`
  fragment MessageReaction on message_reaction {
    id
    message_id
    user_id
    emoji
    updated_at
  }
`;

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
  sync: createHasuraSyncSetupFromFragment<MessageReactionFragment>(messageReactionFragment, {
    upsertIdKey: "message_reaction_pkey",
    insertColumns: ["id", "emoji", "user_id", "message_id"],
    updateColumns: ["emoji"],
  }),
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
