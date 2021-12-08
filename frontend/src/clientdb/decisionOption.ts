import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { DecisionOptionFragment } from "~gql";

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
  getDefaultValues: () => ({
    __typename: "decision_option",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<DecisionOptionFragment>(decisionOptionFragment, {
    insertColumns: ["option", "message_id", "index"],
    updateColumns: ["option"],
    teamScopeCondition: (teamId) => ({ message: { topic: { team_id: { _eq: teamId } } } }),
  }),
});

export type DecisionOption = EntityByDefinition<typeof decisionOptionEntity>;
