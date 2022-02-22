import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useEffect } from "react";

import { forceWorkerSyncRun } from "@aca/desktop/bridge/apps";
import { NotionSpace, notionSelectedSpaceValue } from "@aca/desktop/bridge/apps/notion";
import { notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";

export const NotionSettings = observer(function NotionSpaceSelector() {
  const savedSpaces = notionSelectedSpaceValue.use();
  const notionAuthBridge = notionAuthTokenBridgeValue.use();

  useEffect(() => {
    // Covers corner case of losing notion session without resetting spaces
    if (!notionAuthBridge) {
      notionSelectedSpaceValue.reset();
    }
  }, [notionAuthBridge]);

  if (!savedSpaces?.selected?.length) {
    return <></>;
  }

  const { selected, allSpaces } = toJS(savedSpaces);

  const selectedItem = allSpaces.filter((space) => selected.includes(space.id))[0];

  function handleItemSelected(space: NotionSpace) {
    notionSelectedSpaceValue.set({
      selected: [space.id],
      allSpaces,
    });
    forceWorkerSyncRun(["notion"]);
  }

  return (
    <SettingRow title="Active workspace" description="Workspace you wish to import notifications from.">
      <SingleOptionDropdown<NotionSpace>
        items={allSpaces}
        keyGetter={(space) => space.id}
        labelGetter={(space) => space.name}
        selectedItem={selectedItem}
        onChange={handleItemSelected}
        placeholder="Selected Notion Space"
      />
    </SettingRow>
  );
});
