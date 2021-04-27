import {
  DocumentNode,
  gql,
  MutationFunctionOptions,
  MutationHookOptions,
  MutationOptions,
  QueryHookOptions,
  SubscriptionHookOptions,
  useMutation as useRawMutation,
  useQuery as useRawQuery,
  useSubscription as useRawSubscription,
} from "@apollo/client";
import { print } from "graphql/language/printer";
import produce, { Draft } from "immer";
import { useRef } from "react";
import { assert } from "~shared/assert";
import { apolloClient } from "~frontend/apollo";

type EmptyObject = Record<string, never>;

type VoidableIfEmpty<V> = EmptyObject extends V ? V | void : V;

export function createQuery<Data, Variables>(query: DocumentNode) {
  function useQuery(variables: VoidableIfEmpty<Variables>, options?: QueryHookOptions<Data, Variables>) {
    return useRawQuery(query, { ...options, variables: variables as Variables });
  }

  function update(variables: Variables, updater: (dataDraft: Draft<Data>) => void) {
    const currentData = apolloClient.readQuery<Data, Variables>({ query, variables });

    if (currentData === null) {
      return;
    }

    const newData = produce(currentData, (draft) => {
      updater(draft);

      return draft;
    });

    apolloClient.writeQuery({ query, variables, data: newData });
  }

  function write(variables: Variables, data: Data) {
    apolloClient.writeQuery<Data, Variables>({ query, variables, data });
  }

  function read(variables: Variables) {
    return apolloClient.readQuery<Data, Variables>({ query, variables });
  }

  const manager = {
    update,
    write,
    read,
  };

  return [useQuery, manager] as const;
}

function getQueryNodeFromSubscriptionNode(subscriptionNode: DocumentNode): DocumentNode {
  const subscriptionSource = print(subscriptionNode);

  assert(subscriptionSource, "Incorrect query string cannot be converted to subscription");
  assert(
    subscriptionSource.includes("query"),
    "Incorrect query string cannot be converted to subscription (provided graphql definition is not a query)"
  );

  const queryString = subscriptionSource.replace("subscription", "query");

  const queryNode = gql`
    ${queryString}
  `;

  return queryNode;
}

export function createSubscription<Data, Variables>(subscription: DocumentNode) {
  /**
   * Due to apollo-cache limitations (https://github.com/apollographql/apollo-client/issues/5267)
   * it is not possible to update cache of subscribtion to create optimistic updates.
   *
   * To mitigate it, we'll use both query and subscribtion at the same time. It is possible because in hasura
   * every subscribtion can be converted to query without modifications.
   *
   * What we do is in `useSubscribtion` hook we'll use query and subscribtion at once and return 'latest' result out
   * of the two.
   *
   * This way we can update query cache and it'll be 'official' until next subscribtion native update.
   */

  // Let's create corresponding query node
  const queryNode = getQueryNodeFromSubscriptionNode(subscription);

  // Create query with manager that will be used to update query if needed
  const [useQuery, queryManager] = createQuery<Data, Variables>(queryNode);

  function useSubscription(variables: VoidableIfEmpty<Variables>, options?: SubscriptionHookOptions<Data, Variables>) {
    const queryResult = useQuery(variables);
    const subscriptionResult = useRawSubscription(subscription, { ...options, variables: variables as Variables });

    const data = useLatest(queryResult.data, subscriptionResult.data);

    return {
      ...subscriptionResult,
      data,
    };
  }

  const manager = {
    update: queryManager.update,
    write: queryManager.write,
  };

  return [useSubscription, manager] as const;
}

interface MutationDefinitionOptions<Data, Variables> {
  onSuccess?: (data: Data, variables: Variables) => void;
}

export function createMutation<Data, Variables>(
  mutation: DocumentNode,
  mutationDefinitionOptions?: MutationDefinitionOptions<Data, Variables>
) {
  function useMutation(options?: MutationHookOptions<Data, Variables>) {
    const [runMutationRaw, result] = useRawMutation<Data, Variables>(mutation, options);

    async function runMutation(variables: Variables, options?: MutationFunctionOptions<Data, Variables>) {
      const rawResult = await runMutationRaw({ ...options, variables });

      if (rawResult.data) {
        mutationDefinitionOptions?.onSuccess?.(rawResult.data, variables);
      }

      return rawResult;
    }

    return [runMutation, result] as const;
  }

  async function mutate(variables: Variables, options?: MutationOptions<Data, Variables>) {
    const rawResult = await apolloClient.mutate<Data, Variables>({ ...options, mutation, variables });

    if (rawResult.data) {
      mutationDefinitionOptions?.onSuccess?.(rawResult.data, variables);
    }

    return rawResult;
  }

  const manager = {
    mutate,
  };

  return [useMutation, manager] as const;
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

  return latestRef.current;
}
