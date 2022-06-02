import { createChannelBridge } from "./base/channels";

export interface ApplicationTrayList {
  name: string;
  count: number;
  group?: string;
}

export const requestNavigateToList = createChannelBridge<{ listId: string }>("requestNavigateToList");

export const requestOpenFocusMode = createChannelBridge<{ listId: string }>("requestOpenFocusMode");
