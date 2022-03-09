import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { NotionSpaceFragment, Notion_Space_Bool_Exp, Notion_Space_Insert_Input } from "@aca/gql";

const notionSpace = gql`
  fragment notionSpace on notion_space {
    id
    space_id
    name
    created_at
    updated_at
    created_by
  }
`;

type NotionSpaceConstraints = {
  key: "notification_space_pkey" | "notion_space_space_id_key";
  update: null;
  insert: Notion_Space_Insert_Input;
  where: Notion_Space_Bool_Exp;
};

export const notionSpaceEntity = defineEntity<NotionSpaceFragment>({
  name: "notion_space",
  updatedAtField: "updated_at",
  uniqueIndexes: ["space_id"],
  keyField: "id",
  keys: getFragmentKeys<NotionSpaceFragment>(notionSpace),
  getDefaultValues: () => ({
    __typename: "notion_space",
    created_by: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotionSpaceFragment, NotionSpaceConstraints>(notionSpace, {
    insertColumns: ["id", "space_id", "name", "created_by", "updated_at", "created_at"],
    updateColumns: [],
    upsertConstraint: "notification_space_pkey",
  }),
});

export type NotionSpaceEntity = EntityByDefinition<typeof notionSpaceEntity>;
