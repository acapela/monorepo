import {
  DocumentNode,
  QueryHookOptions,
  QueryOptions,
  SubscriptionHookOptions,
  useQuery as useRawQuery,
  useSubscription as useRawSubscription,
} from "@apollo/client";
import { memoize } from "lodash";
import { useRef } from "react";

import { getRenderedApolloClient } from "~frontend/apollo/client";
import { useAsyncEffect } from "~shared/hooks/useAsyncEffect";
import { VoidableIfEmpty } from "~shared/types";
import { ValueUpdater, updateValue } from "~shared/updateValue";

import { waitForAllRunningMutationsToFinish } from "./createMutation";
import { reportQueryUsage } from "./hydration";
import { getCurrentApolloClientHandler } from "./proxy";
import { unwrapQueryData } from "./unwrapQueryData";

type QueryExecutionOptions = Omit<QueryOptions, "query" | "variables">;

export function createQuery<Data, Variables>(query: () => DocumentNode) {
  type VoidableVariables = VoidableIfEmpty<Variables>;

  const getQuery = memoize(query);
  const getSubscriptionQuery = memoize(() => getSubscriptionNodeFromQueryNode(getQuery()));

  function requestPrefetch(variables: VoidableVariables) {
    reportQueryUsage({ query: getQuery(), variables: variables });
  }

  function useQuery(variables: VoidableVariables, options?: QueryHookOptions<Data, Variables>) {
    // Don't report query usage if skip option is enabled.
    if (!options?.skip) {
      reportQueryUsage({ query: getQuery(), variables: variables });
    }

    const { data, ...rest } = useRawQuery(getQuery(), {
      ...options,
      variables: variables as Variables,
    });

    return [unwrapQueryData(data), rest] as const;
  }

  function useAsSubscription(variables: VoidableVariables, options?: SubscriptionHookOptions<Data, Variables>) {
    const [queryData] = useQuery(variables, options);
    const subscriptionResult = useRawSubscription(getSubscriptionQuery(), {
      ...{
        ...options,
        /**
         * We don't need cache for subscriptions and it can actually introduce hard to debug
         * race conditions.
         *
         * If subscription is connected to cache, all updates it gets are automatically filled into cache.
         * Cache is shared between queries and subscriptions.
         *
         * Possible race condition:
         * Subscription is listening for Room updates (and it's topic via room>topics)
         * You create new room that has callback (optimistic and actual) that pushes new topic to room info fragment
         * Now race condition starts.
         *
         * It is possible that room subscription will pick new info about the room (with new topic!) before mutation
         * result will return to the client!
         *
         * In such case, new topic will already be in the cache before mutation finishes running
         *
         * If that happens, mutation callback will manually add new topic to room fragment even tho it's already there,
         * resulting in duplicate being created.
         *
         *
         * TLDR: subscription is by nature 'up-to-date' so there is no sense to connect it with cache.
         */
        fetchPolicy: "no-cache",
      },
      variables: variables as Variables,
    });

    const data = useLatest(unwrapQueryData(subscriptionResult.data), queryData);

    /**
     * After each subscription data update, we eventually want to use this data to update apollo cache.
     *
     * We're not doing it normally in `useSubscription` hook to avoid race-conditions with optimistic updates
     * where it would be possible that:
     *
     * we send mutation (with cache update callbacks eg. adding item to some list of items)
     * while we wait for mutation to resolve, subscription socket already picked new data first and updated the cache
     * mutation resolves and we call it's callback (resulting in the same item being added twice to some list of items).
     *
     * To avoid it, we update cache with subscription data only after all mutations will finish running (which means
     * all optimistic updates and cache updates are already flushed)
     *
     * Note:
     *
     * Why do we even need this? Initially I thought having `useQuery` is enough to have cache working great.
     *
     * There are however some use cases that would mean not doing it would result in flicker of old results.
     *
     * Use case:
     * eg. we use `topic messages`.
     * Both useQuery and useSubscription are run.
     * useQuery fetches results and adds it to cache properly (let's call it "results A")
     * useSubscription is watching for updates.
     * update happens (eg. some message is added)
     * useSubscription gets it ("results B", but it is not added to cache!)
     * It means next time we use 'topic messages' (eg navigating to other topic and back) we'll first see
     * "results A" from useQuery being quickly replaced by "results B" when subscription gets them again
     */
    useAsyncEffect(
      async (getIsCancelled) => {
        if (!subscriptionResult.data) return;

        await waitForAllRunningMutationsToFinish();

        if (getIsCancelled()) return;

        write(variables as Variables, subscriptionResult.data);
      },
      [subscriptionResult.data]
    );

    return [data, subscriptionResult] as const;
  }

  useAsSubscription.query = useQuery;
  useAsSubscription.requestPrefetch = requestPrefetch;

  function update(variables: Variables, updater: ValueUpdater<Data>) {
    const client = getCurrentApolloClientHandler();
    const currentData = client.readQuery<Data, Variables>({ query: getQuery(), variables });

    if (currentData === null) {
      return;
    }

    const newData = updateValue(currentData, updater);

    client.writeQuery({ query: getQuery(), variables, data: newData });
  }

  function write(variables: Variables, data: Data) {
    getCurrentApolloClientHandler().writeQuery<Data, Variables>({ query: getQuery(), variables, data });
  }

  function read(variables: Variables) {
    return getCurrentApolloClientHandler().readQuery<Data, Variables>({ query: getQuery(), variables });
  }

  async function fetch(variables: Variables, options?: QueryExecutionOptions) {
    const response = await getRenderedApolloClient().query<Data, Variables>({
      query: getQuery(),
      ...options,
      variables,
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }

  function subscribe(variables: Variables, callback: (data: Data) => void) {
    const subscription = getRenderedApolloClient()
      .subscribe<Data, Variables>({ variables, query: getSubscriptionQuery() })
      .subscribe((newResults) => {
        if (!newResults.data) return;

        callback(newResults.data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }

  const manager = {
    update,
    write,
    read,
    fetch,
    subscribe,
    requestPrefetch,
  };

  return [useAsSubscription, manager] as const;
}

function getSubscriptionNodeFromQueryNode(queryNode: DocumentNode): DocumentNode {
  const subscriptionNode = JSON.parse(JSON.stringify(queryNode)) as DocumentNode;

  for (const definition of subscriptionNode.definitions) {
    if (definition.kind === "OperationDefinition" && definition.operation === "query") {
      // Definition type is 'readonly' so TS would complain about assigning it directly. We're working on clone,
      // so mutating it is safe.
      Reflect.set(definition, "operation", "subscription");
    }
  }

  return subscriptionNode;
}

/**
 * Will return the value from the list that was modified most recently.
 */
export function useLatest<T>(...items: T[]) {
  // We will keep track of values 'seen before' to know which value is 'new'
  const itemsAddSet = useRef(new Set<T>());
  // Let's also keep track of last changed value in case there are no changes in some render.
  const latestRef = useRef(items[0]);

  // Let's try to find first value that we don't know meaning it is new
  for (const item of items) {
    if (item === undefined) continue;

    const isNew = !itemsAddSet.current.has(item);

    // Add value to known values
    itemsAddSet.current.add(item);

    if (!isNew) {
      continue;
    }

    // We found new value, don't continue search.
    latestRef.current = item;

    break;
  }

  // After value is found, make sure we don't keep outdated values in list of known values
  // Iterating over all known values - remove those not present in list of values from this render.
  itemsAddSet.current.forEach((existingItem) => {
    if (!items.includes(existingItem)) {
      itemsAddSet.current.delete(existingItem);
    }
  });

  // We're ignoring empty values as 'last values', but if every value is empty, return it instead of last non-empty value.
  if (items.every((item) => item === undefined)) {
    // We can assume T type includes undefined here.
    return undefined as unknown as T;
  }

  return latestRef.current;
}
