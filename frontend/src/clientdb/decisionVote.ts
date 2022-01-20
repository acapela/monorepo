import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  DecisionVoteFragment,
  Decision_Vote_Bool_Exp,
  Decision_Vote_Constraint,
  Decision_Vote_Insert_Input,
  Decision_Vote_Set_Input,
} from "@aca/gql";

import { userEntity } from "./user";

const decisionVoteFragment = gql`
  fragment DecisionVote on decision_vote {
    id
    user_id
    decision_option_id
    updated_at
    created_at
  }
`;

type DecisionVoteConstraints = {
  key: Decision_Vote_Constraint;
  insert: Decision_Vote_Insert_Input;
  update: Decision_Vote_Set_Input;
  where: Decision_Vote_Bool_Exp;
};

export const decisionVoteEntity = defineEntity<DecisionVoteFragment>({
  name: "decision_vote",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<DecisionVoteFragment>(decisionVoteFragment),
  getDefaultValues: () => ({
    __typename: "decision_vote",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<DecisionVoteFragment, DecisionVoteConstraints>(decisionVoteFragment, {
    insertColumns: ["id", "user_id", "decision_option_id"],
    updateColumns: ["decision_option_id"],
    upsertConstraint: "decision_vote_pkey",
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
