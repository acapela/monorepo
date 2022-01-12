import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { topicEntity } from "@aca/frontend/clientdb/topic";
import { userEntity } from "@aca/frontend/clientdb/user";
import { getFragmentKeys } from "@aca/frontend/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/frontend/clientdb/utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "@aca/frontend/clientdb/utils/sync";
import { TopicMemberFragment } from "@aca/gql";

const topicMemberFragment = gql`
  fragment TopicMember on topic_member {
    id
    topic_id
    user_id
    updated_at
  }
`;

export const topicMemberEntity = defineEntity<TopicMemberFragment>({
  name: "topic_member",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TopicMemberFragment>(topicMemberFragment),
  getDefaultValues: () => ({
    __typename: "topic_member",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TopicMemberFragment>(topicMemberFragment, {
    insertColumns: [],
    updateColumns: [],
  }),
}).addConnections((topicMember, { getEntity }) => ({
  get topic() {
    return getEntity(topicEntity).findById(topicMember.topic_id);
  },
  get user() {
    return getEntity(userEntity).findById(topicMember.user_id);
  },
}));

export type TopicMemberEntity = EntityByDefinition<typeof topicMemberEntity>;
