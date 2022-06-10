import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { deleteNotificationList, renameNotificationList } from "@aca/desktop/actions/lists";
import { resolvedList } from "@aca/desktop/domains/list/all";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { ComposeButton } from "@aca/desktop/ui/systemTopBar/ComposeButton";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";
import { TopBarDivider } from "@aca/desktop/ui/systemTopBar/ui";
import { theme } from "@aca/ui/theme";

import { BatchResolverButton } from "./BatchResolverButton";
import { ListEmojiPicker } from "./ListEmojiPicker";
import { ListNotificationsSettings } from "./NotificationsSettings";

interface Props {
  list?: NotificationsList;
}

export const ListViewTopBar = observer(({ list }: Props) => {
  return (
    <SystemTopBar
      navigationItems={
        <>
          <ComposeButton />
        </>
      }
      titleNode={
        <UITitle>
          {list && <ListEmojiPicker list={list} />}
          <ActionButton
            size="compact"
            kind="transparent"
            action={renameNotificationList}
            target={list}
            hideIcon
            notApplicableMode="notClickable"
          >
            {list?.name}
          </ActionButton>
        </UITitle>
      }
      targetActionItems={
        <>
          {!!list && list !== resolvedList && (
            <>
              <BatchResolverButton list={list} />
            </>
          )}

          {list?.listEntity && (
            <>
              <TopBarDivider />
              <ListNotificationsSettings list={list.listEntity} />

              <TopBarActionButton action={deleteNotificationList} target={list} notApplicableMode="hide" />
            </>
          )}
        </>
      }
    />
  );
});

const UITitle = styled.div`
  ${theme.typo.content.medium};
  display: flex;
  align-items: center;
  gap: 2px;
`;
