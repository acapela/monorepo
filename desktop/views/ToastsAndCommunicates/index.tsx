import { uniq } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { defineAction } from "@aca/desktop/actions/action";
import { installUpdate } from "@aca/desktop/actions/app";
import {
  applicationStateBridge,
  applicationWideSettingsBridge,
  setBadgeCountRequest,
  showErrorToUserChannel,
} from "@aca/desktop/bridge/system";
import { getNullableDb } from "@aca/desktop/clientdb";
import { PublicErrorData } from "@aca/desktop/domains/errors/types";
import { useAutorun } from "@aca/shared/sharedState";
import { BodyPortal } from "@aca/ui/BodyPortal";

import { SlackToasts } from "./SlackToasts";
import { Toast } from "./Toast";

// Open notifications are neither resolved nor snoozed
function getOpenNotifications() {
  const listIdsToShowBadge = applicationWideSettingsBridge.get().notificationsCountBadgeListIds;

  if (!listIdsToShowBadge?.length) {
    return getNullableDb()?.notification.query({ isResolved: false, isSnoozed: false }).all;
  }

  const lists = getNullableDb()?.notificationList.query({ id: listIdsToShowBadge }).all ?? [];

  return uniq(lists.map((l) => l.inboxNotifications.all).flat());
}

export const ToastsAndCommunicatesView = observer(() => {
  const { isUpdateReadyToInstall, updateDownloadingPercent } = applicationStateBridge.get();

  const [errors, setErrors] = useState<PublicErrorData[]>([]);
  useEffect(() => {
    return showErrorToUserChannel.subscribe((newError) => {
      setErrors((errors) => [...errors, newError]);
    });
  });

  useAutorun(() => {
    if (!applicationWideSettingsBridge.get().showNotificationsCountBadge) {
      setBadgeCountRequest(0);
      return;
    }

    const openNotifications = getOpenNotifications();

    if (openNotifications === undefined) return;

    const unreadCount = openNotifications.filter((n) => n.isUnread).length;
    if (unreadCount > 0) {
      setBadgeCountRequest(unreadCount);
    } else {
      setBadgeCountRequest(openNotifications.length > 0 ? "•" : 0);
    }
  });

  return (
    <BodyPortal>
      <UIHolder>
        <SlackToasts />
        {isUpdateReadyToInstall && (
          <Toast
            key="update-ready"
            title="Update available"
            description="New version of Acapela is available."
            action={installUpdate}
          />
        )}
        {updateDownloadingPercent && (
          <Toast
            key="downloading"
            title="Downloading update"
            description={`${Math.round(updateDownloadingPercent)}%`}
          />
        )}
        {errors.map((error) => {
          return (
            <Toast
              key={error.id}
              title="Error"
              description={error.message}
              action={defineAction({
                name: "Close",
                handler() {
                  setErrors((errors) => errors.filter((currentError) => currentError.id !== error.id));
                },
              })}
            />
          );
        })}
      </UIHolder>
    </BodyPortal>
  );
});

const UIHolder = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 320px;
  z-index: 9999;
  display: flex;
  gap: 8px;
  flex-direction: column;
  pointer-events: none;

  & > * {
    pointer-events: all;
  }
`;
