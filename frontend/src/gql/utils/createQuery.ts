import {
  DocumentNode,
  gql,
  QueryHookOptions,
  QueryOptions,
  SubscriptionHookOptions,
  useQuery as useRawQuery,
  useSubscription as useRawSubscription,
} from "@apollo/client";
import { print } from "graphql/language/printer";
import produce, { Draft } from "immer";
import { memoize } from "lodash";
import { useRef } from "react";
import { VoidableIfEmpty } from "~shared/types";
import { assert } from "~shared/assert";
import { reportQueryUsage } from "./hydration";
import { unwrapQueryData } from "./unwrapQueryData";
import { getCurrentApolloClientHandler } from "./proxy";
import { getRenderedApolloClient } from "~frontend/apollo/client";
import { addRoleToContext, RequestWithRole } from "./withRole";

type QueryDefinitionOptions = RequestWithRole;

type QueryExecutionOptions = Omit<QueryOptions, "query" | "variables">;

export function createQuery<Data, Variables>(
  query: () => DocumentNode,
  queryDefinitionOptions?: QueryDefinitionOptions
) {
  type VoidableVariables = VoidableIfEmpty<Variables>;

  const getQuery = memoize(query);
  const getSubscriptionQuery = memoize(() => getSubscriptionNodeFromQueryNode(getQuery()));

  function useQuery(variables: VoidableVariables, options?: QueryHookOptions<Data, Variables>) {
    // Don't report query usage if skip option is enabled.
    if (!options?.skip) {
      reportQueryUsage({ query: getQuery(), variables: variables });
    }

    const { data, ...rest } = useRawQuery(getQuery(), {
      ...{
        ...options,
        context: addRoleToContext(options?.context, queryDefinitionOptions?.requestWithRole),
      },
      variables: variables as Variables,
    });

    return [unwrapQueryData(data), rest] as const;
  }

  function useAsSubscription(variables: VoidableVariables, options?: SubscriptionHookOptions<Data, Variables>) {
    const [queryData] = useQuery(variables, options);
    const subscriptionResult = useRawSubscription(getSubscriptionQuery(), {
      ...{
        ...options,
        context: addRoleToContext(options?.context, queryDefinitionOptions?.requestWithRole),
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

    return [data, subscriptionResult] as const;
  }

  useAsSubscription.query = useQuery;

  function update(variables: Variables, updater: (dataDraft: Draft<Data>) => void) {
    const client = getCurrentApolloClientHandler();
    const currentData = client.readQuery<Data, Variables>({ query: getQuery(), variables });

    if (currentData === null) {
      return;
    }

    const newData = produce(currentData, (draft) => {
      updater(draft);

      return draft;
    });

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
      ...{ ...options, context: addRoleToContext(options?.context, queryDefinitionOptions?.requestWithRole) },
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
  };

  return [useAsSubscription, manager] as const;
}

function getSubscriptionNodeFromQueryNode(queryNode: DocumentNode): DocumentNode {
  const subscriptionSource = print(queryNode);

  assert(subscriptionSource, "Incorrect query string cannot be converted to subscription");
  assert(
    subscriptionSource.includes("query"),
    "Incorrect query string cannot be converted to subscription (provided graphql definition is not a query)"
  );

  const subscriptionString = subscriptionSource.replace("query", "subscription");

  const subscriptionNode = gql`
    ${subscriptionString}
  `;

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
