import { createLocalStorageValueManager } from "~shared/localStorage";

export const clientdbForceRefreshCount = createLocalStorageValueManager("clientdb-force-refresh-hash", 0);

export function increaseClientDBForceRefreshCount() {
  clientdbForceRefreshCount.set(clientdbForceRefreshCount.get() + 1);
}
