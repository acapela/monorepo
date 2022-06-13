import { observer } from "mobx-react";
import React from "react";

import { unattachedPreloadBridgeChannel } from "../bridge/preview";
import { useOnClientReadyEffect } from "./useOnClientReady";

export const UnattachedPreloadEmbedManager = observer(
  function UnattachedPreloadEmbedManagerServiceWorkerConsolidation() {
    useOnClientReadyEffect(
      (db) => {
        unattachedPreloadBridgeChannel.subscribe(({ url }) => {
          const n = db.notification.find({ url });
          console.info(url, n[0].kind);
        });
      },
      { isLoginRequired: true }
    );

    return <></>;
  }
);
