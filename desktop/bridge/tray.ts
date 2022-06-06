import { createBridgeValue } from "./base/persistance";

export interface ApplicationTrayList {
  id: string;
  name: string;
  order?: number;
  count: number;
  group?: string;
}

export const applicationTrayStateBridge = createBridgeValue("applicationTrayStateBridge", {
  getDefault: () => ({
    lists: [] as ApplicationTrayList[],
    shouldShowIndicator: false,
  }),
});
