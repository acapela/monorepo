import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { messageEntity } from "~frontend/clientdb/message";
import { DecisionOptionFragment } from "~gql";

import { decisionVoteEntity } from "./decisionVote";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

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
  sync: createHasuraSyncSetupFromFragment<DecisionOptionFragment>(decisionOptionFragment, {
    insertColumns: ["id", "option", "message_id", "index"],
    updateColumns: ["option"],
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
