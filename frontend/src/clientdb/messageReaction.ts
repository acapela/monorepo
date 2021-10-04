import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { MessageReactionFragment } from "~gql";

import { messageEntity } from "./message";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { userIdContext } from "./utils/context";
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
    insertColumns: ["id", "emoji", "user_id", "message_id"],
    updateColumns: ["emoji"],
  }),
}).addConnections((reaction, { getEntity, getContextValue }) => {
  return {
    get message() {
      return getEntity(messageEntity).findById(reaction.message_id);
    },
    get user() {
      return getEntity(userEntity).findById(reaction.user_id);
    },
    get isOwn() {
      return getContextValue(userIdContext) === reaction.user_id;
    },
  };
});

export type MessageReactionEntity = EntityByDefinition<typeof messageReactionEntity>;
