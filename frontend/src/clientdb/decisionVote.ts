import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { DecisionVoteFragment } from "~gql";

import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const decisionVoteFragment = gql`
  fragment DecisionVote on decision_vote {
    id
    user_id
    decision_option_id
    updated_at
    created_at
  }
`;

export const decisionVoteEntity = defineEntity<DecisionVoteFragment>({
  name: "decision_vote",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<DecisionVoteFragment>(decisionVoteFragment),
  getDefaultValues: () => ({
    __typename: "decision_vote",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<DecisionVoteFragment>(decisionVoteFragment, {
    insertColumns: ["id", "user_id", "decision_option_id"],
    updateColumns: ["decision_option_id"],
    teamScopeCondition: (teamId) => ({ decision_option: { message: { topic: { team_id: { _eq: teamId } } } } }),
  }),
}).addConnections((decisionVote, { getEntity }) => {
  const connections = {
    get user() {
      return getEntity(userEntity).findById(decisionVote.user_id);
    },
  };
  return connections;
});

export type DecisionVote = EntityByDefinition<typeof decisionVoteEntity>;
