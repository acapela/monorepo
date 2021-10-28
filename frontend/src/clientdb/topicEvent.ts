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
    created_at
    updated_at
    type

    topic_closed {
      closed_by_user_id
    }

    topic_reopened {
      reopened_by_user_id
    }

    topic_archived {
      archived_by_user_id
    }

    topic_unarchived {
      unarchived_by_user_id
    }
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
