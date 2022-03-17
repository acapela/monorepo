import { throttle } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import { useEffect } from "react";

import { forceWorkerSyncRun } from "@aca/desktop/bridge/apps";
import { notionAvailableSpacesValue, notionSelectedSpaceValue } from "@aca/desktop/bridge/apps/notion";
import { notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";
import { NotionSpaceEntity } from "@aca/desktop/clientdb/notification/notion/notionSpace";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { useBoolean } from "@aca/shared/hooks/useBoolean";
import { Button } from "@aca/ui/buttons/Button";
import { MultipleOptionsDropdown } from "@aca/ui/forms/OptionsDropdown/multiple";

const TEN_SECONDS = 10 * 1000;

const throttledForceNotionSync = throttle(() => forceWorkerSyncRun(["notion"]), TEN_SECONDS, {
  trailing: true,
  leading: false,
});

export const NotionSettings = observer(function NotionSpaceSelector() {
  const db = getDb();

  const notionAuthBridge = notionAuthTokenBridgeValue.use();

  const selectedUserSpaces = db.notionSpaceUser.query({ is_sync_enabled: true }).all;
  const selectedSpaces = selectedUserSpaces.map((spaceUser) => spaceUser.notionSpace);
  const allAvailableSpaces = db.notionSpaceUser.all.map((spaceUser) => spaceUser.notionSpace);

  useEffect(() => {
    // Covers corner case of losing notion session without resetting spaces
    if (notionAuthBridge) {
      const selected = selectedSpaces.map((sp) => sp.space_id);
      const spaces = allAvailableSpaces.map(({ space_id, name }) => ({ id: space_id, name }));

      notionSelectedSpaceValue.set({ selected });
      notionAvailableSpacesValue.set({ spaces });
    }
  }, [notionAuthBridge]);

  // This is done in weird edge cases where we can't get all spaces
  // This usually shouldn't happen, but it's a preventative measure if there's some errors
  const [isLoadingSpaces, { set: setLoadingSpaces, unset: unsetLoadingSpaces }] = useBoolean(false);
  if (!allAvailableSpaces.length) {
    return (
      <SettingRow title="Active spaces" description="Spaces you wish to import notifications from.">
        <Button
          kind="primary"
          isLoading={isLoadingSpaces}
          onClick={() => {
            forceWorkerSyncRun(["notion"]);
            setLoadingSpaces();
            setTimeout(unsetLoadingSpaces, TEN_SECONDS);
          }}
        >
          Load Notion Spaces
        </Button>
      </SettingRow>
    );
  }

  function selectSpace(space: NotionSpaceEntity) {
    const userSpace = db.notionSpaceUser.assertFindByUniqueIndex("notion_space_id", space.id);

    userSpace.update({
      is_sync_enabled: true,
    });
    // Throttled, as people may be clicking around and moving things around
    throttledForceNotionSync();
  }

  function unselectSpace(space: NotionSpaceEntity) {
    const userSpace = db.notionSpaceUser.assertFindByUniqueIndex("notion_space_id", space.id);
    userSpace.update({
      is_sync_enabled: false,
    });
  }

  return (
    <SettingRow title="Active spaces" description="Spaces you wish to import notifications from.">
      <MultipleOptionsDropdown<NotionSpaceEntity>
        items={allAvailableSpaces}
        keyGetter={(space) => space.id}
        labelGetter={(space) => space.name}
        selectedItems={selectedSpaces}
        onItemUnselected={unselectSpace}
        onItemSelected={selectSpace}
        placeholder="Selected Notion Space"
      />
    </SettingRow>
  );
});
