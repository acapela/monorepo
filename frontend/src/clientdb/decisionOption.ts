import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { messageEntity } from "@aca/frontend/clientdb/message";
import {
  DecisionOptionFragment,
  Decision_Option_Bool_Exp,
  Decision_Option_Constraint,
  Decision_Option_Insert_Input,
  Decision_Option_Set_Input,
} from "@aca/gql";

import { decisionVoteEntity } from "./decisionVote";

const decisionOptionFragment = gql`
  fragment DecisionOption on decision_option {
    id
    option
    index
    message_id
    updated_at
    created_at
  }
`;

type DecisionOptionConstraints = {
  key: Decision_Option_Constraint;
  insert: Decision_Option_Insert_Input;
  update: Decision_Option_Set_Input;
  where: Decision_Option_Bool_Exp;
};

export const decisionOptionEntity = defineEntity<DecisionOptionFragment>({
  name: "decision_option",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<DecisionOptionFragment>(decisionOptionFragment),
  defaultSort: (option) => option.index,
  getDefaultValues: () => ({
    __typename: "decision_option",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<DecisionOptionFragment, DecisionOptionConstraints>(decisionOptionFragment, {
    insertColumns: ["id", "option", "message_id", "index"],
    updateColumns: [
      "option",
      // In case message is converted to new request we move all options instead of creating new ones to avoid losing votes
      "message_id",
    ],
    upsertConstraint: "decision_option_pkey",
    teamScopeCondition: (teamId) => ({ message: { topic: { team_id: { _eq: teamId } } } }),
  }),
}).addConnections((decisionOption, { getEntity }) => {
  const connections = {
    get message() {
      return getEntity(messageEntity).findById(decisionOption.message_id);
    },
    get votes() {
      return getEntity(decisionVoteEntity).query({ decision_option_id: decisionOption.id });
    },
  };
  return connections;
});

export type DecisionOption = EntityByDefinition<typeof decisionOptionEntity>;
