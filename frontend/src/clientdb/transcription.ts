import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { TranscriptionFragment } from "@aca/gql";

import { getFragmentKeys } from "./utils/analyzeFragment";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const transcriptionFragment = gql`
  fragment Transcription on transcription {
    id
    created_at
    status
    transcript
    updated_at
  }
`;

export const transcriptionEntity = defineEntity<TranscriptionFragment>({
  name: "transcription",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TranscriptionFragment>(transcriptionFragment),
  getDefaultValues: () => ({
    __typename: "transcription",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TranscriptionFragment>(transcriptionFragment, {
    insertColumns: [],
    updateColumns: [],
    teamScopeCondition: (teamId) => ({ attachments: { message: { topic: { team_id: { _eq: teamId } } } } }),
  }),
});

export type TranscriptionEntity = EntityByDefinition<typeof transcriptionEntity>;
