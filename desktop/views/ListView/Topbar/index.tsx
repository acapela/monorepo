import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { forceNotificationsSync } from "@aca/desktop/actions/app";
import { deleteNotificationList, renameNotificationList } from "@aca/desktop/actions/lists";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";
import { theme } from "@aca/ui/theme";

import { ListNotificationsSettings } from "./NotificationsSettings";

interface Props {
  list?: NotificationsList;
}

export const ListViewTopBar = observer(({ list }: Props) => {
  return (
    <SystemTopBar
      navigationItems={
        <>
          <TopBarActionButton action={forceNotificationsSync} />
        </>
      }
      titleNode={<UITitle>{list?.name}</UITitle>}
      targetActionItems={
        list?.listEntity && (
          <>
            <ListNotificationsSettings list={list.listEntity} />
            <TopBarActionButton action={renameNotificationList} />
            <TopBarActionButton action={deleteNotificationList} />
          </>
        )
      }
    />
  );
});

const UITitle = styled.div`
  ${theme.typo.content.medium}
`;
