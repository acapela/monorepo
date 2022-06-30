import { gql } from "@apollo/client";
import { observer } from "mobx-react";
import React from "react";

import { HandleRevertUrlViewMutation, HandleRevertUrlViewMutationVariables } from "@aca/gql";

import { apolloClient } from "../apolloClient";
import { previewLoadedChannel, previewUnattachedChannel } from "../bridge/preview";
import { NotificationEntity, notificationEntity } from "../clientdb/notification";
import { useOnClientReadyEffect } from "./useOnClientReady";

export const IntegrationReadSyncManager = observer(function IntegrationReadSyncManager() {
  useOnClientReadyEffect(
    (db) => {
      previewLoadedChannel.subscribe(({ url }) => {
        const notification = db.entity(notificationEntity).find({ url })?.[0] ?? null;
        if (notification) {
          notification.update({ last_preloaded_at: new Date().toISOString() });
        }
      });

      previewUnattachedChannel.subscribe(({ url }) => {
        const notification = db.entity(notificationEntity).find({ url })?.[0] ?? null;
        if (notification) {
          handleUnattachedPreload(notification);
        }
      });
    },
    { isLoginRequired: true }
  );

  return <></>;
});

async function handleUnattachedPreload(notification: NotificationEntity) {
  // We're currently only using this for reverting gmail unreads
  // Because of this, the business logic check of `notification.last_seen_at`
  // is currently leaking into this file in order to avoid unnecessary db calls
  if (notification.inner && notification.inner.__typename === "notification_gmail" && !notification.last_seen_at) {
    mutateRevertUrlView(notification.inner.id, notification.inner.__typename);
  }
}

async function mutateRevertUrlView(inner_notification_id: string, inner_table_type: string) {
  await apolloClient.mutate<HandleRevertUrlViewMutation, HandleRevertUrlViewMutationVariables>({
    mutation: gql`
      mutation HandleRevertUrlView($input: HandleRevertUrlViewInput!) {
        result: handle_revert_url_view(input: $input) {
          success
        }
      }
    `,
    variables: { input: { inner_notification_id, inner_table_type } },
    fetchPolicy: "no-cache",
  });
}
