import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { GoogleDriveFileFragment } from "@aca/gql";

export const googleDriveFileFragment = gql`
  fragment GoogleDriveFile on google_drive_file {
    id
    created_at
    updated_at
    google_drive_original_file_id
    name
    source
  }
`;
export const googleDriveFileEntity = defineEntity<GoogleDriveFileFragment>({
  keyField: "id",
  name: "google_drive_file",
  updatedAtField: "updated_at",
  keys: getFragmentKeys<GoogleDriveFileFragment>(googleDriveFileFragment),
  sync: createHasuraSyncSetupFromFragment<GoogleDriveFileFragment>(googleDriveFileFragment),
});

export type GoogleDriveFileEntity = EntityByDefinition<typeof googleDriveFileEntity>;
