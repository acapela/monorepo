import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { exitFocusMode, refreshNotificationPreview } from "@aca/desktop/actions/focus";
import {
  addReminderToNotification,
  copyNotificationLink,
  openNotificationInApp,
  resolveNotification,
  unresolveNotification,
} from "@aca/desktop/actions/notification";
import { PreviewLoadingPriority } from "@aca/desktop/domains/embed";
import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { getPrimaryNotification } from "@aca/desktop/domains/group/group";
import { NotificationPreview } from "@aca/desktop/domains/notification/NotificationPreview";
import { ActionSystemMenuItem } from "@aca/desktop/domains/systemMenu/ActionSystemMenuItem";
import { SystemMenuGroup } from "@aca/desktop/domains/systemMenu/SystemMenuGroup";
import { AppLayout } from "@aca/desktop/layout/AppLayout";
import { appViewContainerStyles } from "@aca/desktop/layout/Container";
import { FocusSession } from "@aca/desktop/store/focus";

import { FocusModeFooter } from "./FocusModeFooter";
import { FocusModeTopBar } from "./TopBar";

interface Props {
  session: FocusSession;
}

export const FocusModeView = observer(({ session }: Props) => {
  const { activeNotification, notificationsToPreload } = session;

  return (
    <AppLayout footer={<FocusModeFooter />} transparent>
      <ActionSystemMenuItem action={unresolveNotification} path={["Notification"]} target={activeNotification} />
      <ActionSystemMenuItem action={resolveNotification} path={["Notification"]} target={activeNotification} />
      <ActionSystemMenuItem action={addReminderToNotification} path={["Notification"]} target={activeNotification} />
      <SystemMenuGroup>
        <ActionSystemMenuItem action={refreshNotificationPreview} path={["Notification"]} target={activeNotification} />
        <ActionSystemMenuItem action={openNotificationInApp} path={["Notification"]} target={activeNotification} />
        <ActionSystemMenuItem action={copyNotificationLink} path={["Notification"]} target={activeNotification} />
        <ActionSystemMenuItem action={exitFocusMode} path={["View"]} target={activeNotification} group="foo" />
      </SystemMenuGroup>

      <FocusModeTopBar item={activeNotification} />
      <UIHeader>
        {notificationsToPreload.map((notificationToPreload) => {
          return (
            <PreloadEmbed
              priority={PreviewLoadingPriority.next}
              key={notificationToPreload.id}
              url={notificationToPreload.url}
            />
          );
        })}
      </UIHeader>
      <NotificationPreview notification={getPrimaryNotification(activeNotification)} />
    </AppLayout>
  );
});

const UIHeader = styled.div`
  ${appViewContainerStyles};
`;
