import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";

import { connectFigma, connectGoogle, connectNotion } from "@aca/desktop/actions/auth";
import { forceWorkerSyncRun } from "@aca/desktop/bridge/apps";
import { NotionSpace, notionSelectedSpaceValue } from "@aca/desktop/bridge/apps/notion";
import { notionAuthTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { TraySidebarLayout } from "@aca/desktop/layout/TraySidebarLayout/TraySidebarLayout";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { SingleOptionDropdown } from "@aca/ui/forms/OptionsDropdown/single";
import { HStack } from "@aca/ui/Stack";
import { theme } from "@aca/ui/theme";

import { InstallSlackButton } from "./InstallSlackButton";

export const SettingsView = observer(function SettingsView() {
  return (
    <TraySidebarLayout>
      <UIHolder>
        <UIHeader>Settings</UIHeader>

        <ActionButton action={connectGoogle} />
        <HStack alignItems="center" gap={10}>
          <ActionButton action={connectNotion} />
          <NotionSpaceSelector />
        </HStack>
        <ActionButton action={connectFigma} />

        <InstallSlackButton />
        <UIVersionInfo>v{window.electronBridge.env.version}</UIVersionInfo>
      </UIHolder>
    </TraySidebarLayout>
  );
});

const NotionSpaceSelector = observer(function NotionSpaceSelector() {
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
    <SingleOptionDropdown<NotionSpace>
      items={allSpaces}
      keyGetter={(space) => space.id}
      labelGetter={(space) => space.name}
      selectedItem={selectedItem}
      onChange={handleItemSelected}
      placeholder="Selected Notion Space"
    />
  );
});

const UIHolder = styled.div<{}>`
  padding: 26px 20px;

  display: flex;
  flex-direction: column;

  ${theme.spacing.pageSections.asGap}
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle};
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap}
`;

const UIVersionInfo = styled.div`
  ${theme.typo.label.secondary.center};
`;
