import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { DesktopUserSlackInstallationFragment } from "@aca/gql";

const userSlackInstallationFragment = gql`
  fragment DesktopUserSlackInstallation on user_slack_installation {
    id
    user_id
    updated_at
    created_at
  }
`;

export const userSlackInstallationEntity = defineEntity<DesktopUserSlackInstallationFragment>({
  name: "user_slack_installation",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<DesktopUserSlackInstallationFragment>(userSlackInstallationFragment),
  getDefaultValues: () => ({
    __typename: "user_slack_installation",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<DesktopUserSlackInstallationFragment>(userSlackInstallationFragment),
});

export type UserSlackInstallationEntity = EntityByDefinition<typeof userSlackInstallationEntity>;
