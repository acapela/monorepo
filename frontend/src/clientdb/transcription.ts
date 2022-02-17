import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { TranscriptionFragment, Transcription_Bool_Exp } from "@aca/gql";

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
    transcript: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TranscriptionFragment, { where: Transcription_Bool_Exp }>(
    transcriptionFragment,
    {
      teamScopeCondition: (teamId) => ({ attachments: { message: { topic: { team_id: { _eq: teamId } } } } }),
    }
  ),
});

export type TranscriptionEntity = EntityByDefinition<typeof transcriptionEntity>;
