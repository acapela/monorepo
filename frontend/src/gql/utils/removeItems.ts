import { ApolloCache } from "@apollo/client";
import { isPlainObject } from "lodash";
import { isPrimitive } from "utility-types";
import { removeElementsFromArrayByFilter, removeElementFromArray } from "~shared/array";

const removedItemsIds: string[] = [];

export function markItemAsRemoved(itemId: string) {
  console.log("mark", { itemId });
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

function isItemRemoved(item: any): boolean {
  if (!item) return false;
  if (!item.id) return false;

  console.log("item has id", { removedItemsIds }, item.id);

  return removedItemsIds.includes(item.id);
}

export function removeRemovedItemsFromData<D>(data: D) {
  if (isPrimitive(data)) {
    return data;
  }

  console.log("here we go", data);
  if (Array.isArray(data)) {
    console.log("array");
    for (const item of data) {
      console.log("item", { item });
      if (isItemRemoved(item)) {
        console.log({ item });
        removeElementFromArray(data, item);
      } else {
        removeRemovedItemsFromData(item);
      }
    }
  }

  if (isPlainObject(data)) {
    Object.keys(data).forEach((key) => {
      const value = Reflect.get(data as Record<string, unknown>, key);

      if (isPrimitive(value)) {
        return;
      }

      removeRemovedItemsFromData(Reflect.get(data as Record<string, unknown>, key));
    });
  }

  return data;
}
