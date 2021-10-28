import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { topicEntity } from "~frontend/clientdb/topic";
import { userEntity } from "~frontend/clientdb/user";
import { getFragmentKeys } from "~frontend/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "~frontend/clientdb/utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "~frontend/clientdb/utils/sync";
import { TopicMemberFragment } from "~gql";

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
