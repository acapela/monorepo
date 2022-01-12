/* eslint-disable @typescript-eslint/no-non-null-assertion */
import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { LastSeenMessageFragment } from "@aca/gql";

import { messageEntity } from "./message";
import { topicEntity } from "./topic";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { userIdContext } from "./utils/context";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

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
  sync: createHasuraSyncSetupFromFragment<LastSeenMessageFragment>(lastSeenMessageFragment, {
    insertColumns: ["id", "message_id", "seen_at", "topic_id"],
    updateColumns: ["message_id", "topic_id", "seen_at"],
    teamScopeCondition: (teamId) => ({ topic: { team_id: { _eq: teamId } } }),
  }),
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
