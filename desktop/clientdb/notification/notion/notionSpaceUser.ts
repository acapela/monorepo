import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { notionSelectedSpaceValue } from "@aca/desktop/bridge/apps/notion";
import {
  NotionSpaceUserFragment,
  Notion_Space_User_Bool_Exp,
  Notion_Space_User_Constraint,
  Notion_Space_User_Insert_Input,
  Notion_Space_User_Set_Input,
} from "@aca/gql";

import { notionSpaceEntity } from "./notionSpace";

const notionSpaceUser = gql`
  fragment notionSpaceUser on notion_space_user {
    id
    notion_space_id
    user_id
    first_synced_at
    is_sync_enabled
    created_at
    updated_at
  }
`;

type NotionSpaceUserConstraints = {
  key: Notion_Space_User_Constraint;
  update: Notion_Space_User_Set_Input;
  insert: Notion_Space_User_Insert_Input;
  where: Notion_Space_User_Bool_Exp;
};

export const notionSpaceUserEntity = defineEntity<NotionSpaceUserFragment>({
  name: "notion_space_user",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotionSpaceUserFragment>(notionSpaceUser),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "notion_space_user",
    user_id: getContextValue(userIdContext) ?? undefined,
    first_synced_at: new Date().toISOString(),
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotionSpaceUserFragment, NotionSpaceUserConstraints>(notionSpaceUser, {
    insertColumns: [
      "id",
      "notion_space_id",
      "user_id",
      "is_sync_enabled",
      "created_at",
      "updated_at",
      "first_synced_at",
    ],
    updateColumns: ["is_sync_enabled", "updated_at"],
    upsertConstraint: "notion_space_user_user_id_notion_space_id_key",
  }),
})
  .addConnections((notionSpaceUser, { getEntity }) => ({
    get notionSpace() {
      return getEntity(notionSpaceEntity).assertFindById(notionSpaceUser.notion_space_id);
    },
  }))
  .addEventHandlers({
    itemAdded(dataNow, { getEntity }) {
      if (dataNow.is_sync_enabled) {
        const selected = getEntity(notionSpaceUserEntity)
          .all.filter((spaceUser) => spaceUser.is_sync_enabled)
          .map((spaceUser) => spaceUser.notionSpace.space_id);
        notionSelectedSpaceValue.set({ selected });
      }
    },

    itemUpdated(dataNow, dataBefore, { getEntity }) {
      if (dataNow.is_sync_enabled !== dataBefore.is_sync_enabled) {
        const selected = getEntity(notionSpaceUserEntity)
          .all.filter((spaceUser) => spaceUser.is_sync_enabled)
          .map((spaceUser) => spaceUser.notionSpace.space_id);
        notionSelectedSpaceValue.set({ selected });
      }
    },
  });

export type NotionSpaceUserEntity = EntityByDefinition<typeof notionSpaceUserEntity>;
