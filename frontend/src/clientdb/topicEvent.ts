import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { TopicEventFragment } from "~gql";

import { topicEntity } from "./topic";
import { userEntity } from "./user";
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

    topic_event_topic {
      from_closed_at
      to_closed_at
      from_archived_at
      to_archived_at
      from_name
      to_name
    }
  }
`;

export const topicEventEntity = defineEntity<TopicEventFragment>({
  name: "topic_event",
  updatedAtField: "updated_at",
  keyField: "id",
  defaultSort: (event) => new Date(event.created_at).getTime(),
  keys: getFragmentKeys<TopicEventFragment>(topicEventFragment),
  getDefaultValues: () => ({
    __typename: "topic_event",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TopicEventFragment>(topicEventFragment, {
    teamScopeCondition: (teamId) => ({ topic: { team_id: { _eq: teamId } } }),
  }),
}).addConnections((topicEvent, { getEntity }) => {
  return {
    get actor() {
      return topicEvent.actor_id ? getEntity(userEntity).findById(topicEvent.actor_id) : null;
    },
    get topic() {
      return getEntity(topicEntity).findById(topicEvent.topic_id);
    },
  };
});

export type TopicEventEntity = EntityByDefinition<typeof topicEventEntity>;
