import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { deleteNotificationList, renameNotificationList, resolveAllNotifications } from "@aca/desktop/actions/lists";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { ComposeButton } from "@aca/desktop/ui/systemTopBar/ComposeButton";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";
import { TopBarDivider } from "@aca/desktop/ui/systemTopBar/ui";
import { theme } from "@aca/ui/theme";

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
          {list?.listEntity && <ListEmojiPicker list={list.listEntity} />}
          <ActionButton size="compact" kind="transparent" action={renameNotificationList} target={list} hideIcon>
            {list?.name}
          </ActionButton>
        </UITitle>
      }
      targetActionItems={
        <>
          <TopBarActionButton action={resolveAllNotifications} />

          {list?.listEntity && (
            <>
              <TopBarDivider />
              <ListNotificationsSettings list={list.listEntity} />
              <TopBarActionButton action={renameNotificationList} />

              <TopBarActionButton action={deleteNotificationList} />
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
