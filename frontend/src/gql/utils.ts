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
import { getApolloClient } from "~frontend/apollo";
import { reportQueryUseage } from "./hydration";

type EmptyObject = Record<string, never>;
type VoidableIfEmpty<V> = EmptyObject extends V ? V | void : V;

export function createQuery<Data, Variables>(query: DocumentNode) {
  const subscriptionQuery = getSubscribtionNodeFromQueryNode(query);
  function useQuery(variables: VoidableIfEmpty<Variables>, options?: QueryHookOptions<Data, Variables>) {
    reportQueryUseage({ query, variables: variables });

    return useRawQuery(query, { ...options, variables: variables as Variables });
  }

  function useAsSubscribtion(
    variables: VoidableIfEmpty<Variables>,
    options?: SubscriptionHookOptions<Data, Variables>
  ) {
    const queryResult = useQuery(variables);
    const subscriptionResult = useRawSubscription(subscriptionQuery, { ...options, variables: variables as Variables });

    const data = useLatest(subscriptionResult.data, queryResult.data);

    return {
      ...subscriptionResult,
      data,
    };
  }

  useQuery.subscription = useAsSubscribtion;

  function update(variables: Variables, updater: (dataDraft: Draft<Data>) => void) {
    const client = getApolloClient();
    const currentData = client.readQuery<Data, Variables>({ query, variables });

    if (currentData === null) {
      return;
    }

    const newData = produce(currentData, (draft) => {
      updater(draft);

      return draft;
    });

    client.writeQuery({ query, variables, data: newData });
  }

  function write(variables: Variables, data: Data) {
    getApolloClient().writeQuery<Data, Variables>({ query, variables, data });
  }

  function read(variables: Variables) {
    return getApolloClient().readQuery<Data, Variables>({ query, variables });
  }

  async function fetch(variables: Variables) {
    const response = await i().query<Data, Variables>({ query, variables });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }

  const manager = {
    update,
    write,
    read,
    fetch,
  };

  return [useQuery, manager] as const;
}

function getSubscribtionNodeFromQueryNode(queryNode: DocumentNode): DocumentNode {
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
    const rawResult = await getApolloClient().mutate<Data, Variables>({ ...options, mutation, variables });

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

  return latestRef.current;
}
