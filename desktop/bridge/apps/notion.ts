import { createChannelBridge } from "@aca/desktop/bridge/base/channels";
import { createSessionBridgeValue } from "@aca/desktop/bridge/base/persistance";

import { NotionWorkerSync } from "./notion.types";

export const notionSyncPayload = createChannelBridge<NotionWorkerSync>("notion-worker-sync");

export interface NotionSpace {
  id: string;
  name: string;
}

export const notionSelectedSpaceValue = createSessionBridgeValue<{ selected: string[] }>("notion-selected-spaces", {
  getDefault: () => ({ selected: [] }),
  isPersisted: true,
});

export const notionAvailableSpacesValue = createSessionBridgeValue<{ spaces: NotionSpace[] }>(
  "notion-available-spaces",
  {
    getDefault: () => ({ spaces: [] }),
    isPersisted: true,
  }
);
