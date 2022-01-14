import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  MessageReactionFragment,
  Message_Reaction_Bool_Exp,
  Message_Reaction_Constraint,
  Message_Reaction_Insert_Input,
  Message_Reaction_Set_Input,
} from "@aca/gql";

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

type MessageReactionConstraints = {
  key: Message_Reaction_Constraint;
  insert: Message_Reaction_Insert_Input;
  update: Message_Reaction_Set_Input;
  where: Message_Reaction_Bool_Exp;
};

export const messageReactionEntity = defineEntity<MessageReactionFragment>({
  name: "messageReaction",
  keyField: "id",
  updatedAtField: "updated_at",
  keys: getFragmentKeys<MessageReactionFragment>(messageReactionFragment),
  getDefaultValues({ getContextValue }) {
    return {
      __typename: "message_reaction",
      user_id: getContextValue(userIdContext) ?? undefined,
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<MessageReactionFragment, MessageReactionConstraints>(
    messageReactionFragment,
    {
      insertColumns: ["id", "emoji", "user_id", "message_id"],
      updateColumns: ["emoji"],
      upsertConstraint: "message_reaction_pkey",
      teamScopeCondition: (teamId) => ({ message: { topic: { team_id: { _eq: teamId } } } }),
    }
  ),
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
