import { useQuery, useSubscription } from "@apollo/client";
import { DocumentNode } from "graphql";
import _ from "lodash";
import { useEffect, useMemo } from "react";

import { Exact, Maybe } from "~gql";

type UpdateableItem = { id: string; updated_at?: Maybe<string> };

/**
 * Queries for a list of items (using queryDocument), setting up subscriptions for keeping up with
 * updates (updateSubscriptionDocument) and deletions (existenceSubscriptionDocument).
 * The given query and subscriptions need to use the same conditions, which is semi-enforced by
 * them all sharing the same variables parameter. They also need to have the same field, identifiable
 * by itemsKey.
 */
export function useQueryItemsWithUpdates<
  ItemsKey extends string,
  Query extends Record<ItemsKey, UpdateableItem[]>,
  QueryVariables,
  UpdateSubscription extends Record<ItemsKey, UpdateableItem[]>,
  UpdateSubscriptionVariables extends { lastUpdatedAt: string },
  ExistenceSubscription extends Record<ItemsKey, Exact<{ id: string }>[]>,
  ExistenceSubscriptionVariables
>({
  queryDocument,
  updateSubscriptionDocument,
  existenceSubscriptionDocument,
  variables,
  itemsKey,
}: {
  queryDocument: DocumentNode;
  updateSubscriptionDocument: DocumentNode;
  existenceSubscriptionDocument: DocumentNode;
  variables: QueryVariables & Omit<UpdateSubscriptionVariables, "lastUpdatedAt"> & ExistenceSubscriptionVariables;
  itemsKey: ItemsKey;
}): { items: Query[ItemsKey]; existingItemIds: Set<string> | null; loading: boolean } {
  // This query fetches the initial data, we will also modify this query's cache in the rest of the function
  const { data, loading, subscribeToMore } = useQuery<Query, QueryVariables>(queryDocument, { variables });

  // This last subscription listens to field changes and newly added items, the latter of which get added to
  // the original query's cache
  const items = useMemo(() => (data ? data[itemsKey] : ([] as unknown as Query[ItemsKey])), [data, itemsKey]);
  const lastUpdatedAt = useMemo(() => {
    const lastTimestamp = _.max(items.map((item) => (item.updated_at ? new Date(item.updated_at) : null)));
    return (
      lastTimestamp ??
      // if there are no items (yet), we need a zero point in time, so I picked my birthday
      new Date(1991, 6, 3)
    );
  }, [items]);
  useEffect(
    () =>
      subscribeToMore<UpdateSubscription, UpdateSubscriptionVariables>({
        document: updateSubscriptionDocument,
        variables: { ...variables, lastUpdatedAt } as never,
        updateQuery(previous, { subscriptionData }) {
          const updatedItems = subscriptionData.data[itemsKey];
          const previousItems = previous[itemsKey];
          const previousItemIds = new Set(previousItems.map((t) => t.id));
          const newItems = updatedItems.filter((t) => !previousItemIds.has(t.id));
          return { ...previous, [itemsKey]: [...previousItems, ...newItems] };
        },
      }),
    [itemsKey, lastUpdatedAt, subscribeToMore, updateSubscriptionDocument, variables]
  );

  // This subscription only listens to absence/presence changes of the queried items for the same condition.
  // It is type-checked to only subscribe to their id, to prevent over-subscribing.
  const { data: existenceData } = useSubscription<ExistenceSubscription, ExistenceSubscriptionVariables>(
    existenceSubscriptionDocument,
    { variables }
  );
  const existingItemIds = useMemo(
    () => (existenceData ? new Set(existenceData[itemsKey].map((t) => t.id)) : null),
    [existenceData, itemsKey]
  );

  return {
    items: existingItemIds ? (items.filter((t) => existingItemIds.has(t.id)) as Query[ItemsKey]) : items,
    existingItemIds,
    loading,
  };
}
