import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { deleteNotificationList, renameNotificationList } from "@aca/desktop/actions/lists";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { ComposeButton } from "@aca/desktop/ui/systemTopBar/ComposeButton";
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
          <ComposeButton />
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
