import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { TopicEventFragment } from "~gql";

import { getFragmentKeys } from "./utils/analyzeFragment";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const topicEventFragment = gql`
  fragment TopicEvent on topic_event {
    id
    topic_id
    actor_id
    created_at
    updated_at
  }
`;

export const topicEventEntity = defineEntity<TopicEventFragment>({
  name: "topic_event",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TopicEventFragment>(topicEventFragment),
  getDefaultValues: () => ({
    __typename: "topic_event",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TopicEventFragment>(topicEventFragment, {
    teamScopeCondition: (teamId) => ({ topic: { team_id: { _eq: teamId } } }),
  }),
});
