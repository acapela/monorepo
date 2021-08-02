import { ApolloCache } from "@apollo/client";

const removedItemsIds: string[] = [];

export function markItemAsRemoved(itemId: string) {
  removedItemsIds.push(itemId);
}

export function ensureNoRemovedItemInCache(cache: ApolloCache<unknown>) {
  for (const removedItemId of removedItemsIds) {
    const didRemove = cache.evict({ id: removedItemId, broadcast: true });

    if (didRemove) {
      console.log("did remove", removedItemId);
    }
  }
}
