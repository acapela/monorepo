import { getLocalStorageValueManager } from "~shared/localStorage";

export const clientdbForceRefreshCount = getLocalStorageValueManager("clientdb-force-refresh-hash", 0);

export function increaseClientDBForceRefreshCount() {
  clientdbForceRefreshCount.set(clientdbForceRefreshCount.get() + 1);
}
