import { gql } from "@apollo/client";
import { observer } from "mobx-react";
import React from "react";

import { HandleRevertUrlViewMutation, HandleRevertUrlViewMutationVariables } from "@aca/gql";

import { apolloClient } from "../apolloClient";
import { unattachedPreloadBridgeChannel } from "../bridge/preview";
import { NotificationEntity } from "../clientdb/notification";
import { useOnClientReadyEffect } from "./useOnClientReady";

export const UnattachedPreloadEmbedManager = observer(
  function UnattachedPreloadEmbedManagerServiceWorkerConsolidation() {
    useOnClientReadyEffect(
      (db) => {
        unattachedPreloadBridgeChannel.subscribe(({ url }) => {
          const notification = db.notification.find({ url })?.[0] ?? null;
          if (notification) {
            handleUnattachedPreload(notification);
          }
        });
      },
      { isLoginRequired: true }
    );

    return <></>;
  }
);

async function handleUnattachedPreload(notification: NotificationEntity) {
  if (notification.inner) {
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
