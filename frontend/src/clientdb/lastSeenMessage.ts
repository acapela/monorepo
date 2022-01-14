import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  LastSeenMessageFragment,
  Last_Seen_Message_Bool_Exp,
  Last_Seen_Message_Constraint,
  Last_Seen_Message_Insert_Input,
  Last_Seen_Message_Set_Input,
} from "@aca/gql";

import { messageEntity } from "./message";
import { topicEntity } from "./topic";

const lastSeenMessageFragment = gql`
  fragment LastSeenMessage on last_seen_message {
    id
    updated_at
    seen_at
    message_id
    topic_id
    user_id
  }
`;

type LastSeenMessageConstraints = {
  key: Last_Seen_Message_Constraint;
  insert: Last_Seen_Message_Insert_Input;
  update: Last_Seen_Message_Set_Input;
  where: Last_Seen_Message_Bool_Exp;
};

export const lastSeenMessageEntity = defineEntity<LastSeenMessageFragment>({
  name: "lastSeenMessage",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<LastSeenMessageFragment>(lastSeenMessageFragment),
  getDefaultValues({ getContextValue }) {
    return {
      __typename: "last_seen_message",
      seen_at: new Date().toISOString(),
      user_id: getContextValue(userIdContext) ?? undefined,
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<LastSeenMessageFragment, LastSeenMessageConstraints>(
    lastSeenMessageFragment,
    {
      insertColumns: ["id", "message_id", "seen_at", "topic_id"],
      updateColumns: ["message_id", "topic_id", "seen_at"],
      upsertConstraint: "last_seen_message_pkey",
      teamScopeCondition: (teamId) => ({ topic: { team_id: { _eq: teamId } } }),
    }
  ),
}).addConnections((lastSeenMessage, { getEntity }) => {
  return {
    get message() {
      return getEntity(messageEntity).findById(lastSeenMessage.message_id);
    },
    get topic() {
      return getEntity(topicEntity).findById(lastSeenMessage.topic_id);
    },
  };
});

export type LastSeenMessageEntity = EntityByDefinition<typeof lastSeenMessageEntity>;
