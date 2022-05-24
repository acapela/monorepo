import { createBridgeValue } from "./base/persistance";

export interface ApplicationTrayList {
  id: string;
  name: string;
  count: number;
  group?: string;
}

export const applicationTrayStateBridge = createBridgeValue("applicationTrayStateBridge", {
  getDefault: () => ({
    lists: [] as ApplicationTrayList[],
  }),
});
