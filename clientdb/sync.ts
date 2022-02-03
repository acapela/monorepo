import { ApolloClient } from "@apollo/client";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { max, pick, upperFirst } from "lodash";

import { PullSyncRequestsSubscription, PullSyncRequestsSubscriptionVariables } from "@aca/gql";
import { assert } from "@aca/shared/assert";
import { runUntracked } from "@aca/shared/mobx/utils";

import { Entity, EntitySyncConfig } from "./entity";
import { analyzeFragment } from "./utils/analyzeFragment";
import { apolloContext, teamIdContext } from "./utils/context";

/**
 * We use special 'sync_request' table for 2 purposes:
 * 1. To track deletes
 * 2. To track updates that might cause lost access to some item due to permissions.
 *
 * We'll fetch all 'sync requests' since we last checked. For all deletes we'll simply remove those locally
 * For updates we'll check if we still have access to them, if not - we'll also delete them locally.
 */
const syncRequestFragment = gql`
  fragment SyncRequest on sync_request {
    id
    change_type
    date
    entity_id
  }
`;

const pullSyncRequestsSubscription = gql`
  ${syncRequestFragment}
  subscription PullSyncRequests($lastSyncDate: timestamptz!, $entityName: String!, $teamId: uuid!) {
    sync_request(
      where: { date: { _gt: $lastSyncDate }, entity_name: { _eq: $entityName }, team_id: { _eq: $teamId } }
    ) {
      ...SyncRequest
    }
  }
`;

const gqlTag = gql;

type EntityConstraints<Key = unknown, Insert = unknown, Update = unknown, Where extends {} = {}> = (
  | {
      key?: never;
      insert: Insert;
      update?: never;
    }
  | {
      key?: never;
      insert?: never;
      update: Update;
    }
  | {
      key: Key;
      insert: Insert;
      update: Update;
    }
  | {
      key?: never;
      insert?: never;
      update?: never;
    }
) & {
  where?: Where;
};

type KeysAsArray<T> = Array<keyof T>;

type InsertOnlyOptions<Constraints extends EntityConstraints> = {
  updateColumns: KeysAsArray<Constraints["update"]>;
  insertColumns?: never;
  upsertConstraint?: never;
};

type UpdateOnlyOptions<Constraints extends EntityConstraints> = {
  insertColumns: KeysAsArray<Constraints["insert"]>;
  updateColumns?: never;
  upsertConstraint?: never;
};

type UpsertOptions<Constraints extends EntityConstraints> = {
  updateColumns: KeysAsArray<Constraints["update"]>;
  insertColumns: KeysAsArray<Constraints["insert"]>;
  upsertConstraint: Constraints["key"] extends string ? Constraints["key"] : never;
};

type ReadOnlyOptions = { insertColumns?: never; updateColumns?: never; upsertConstraint?: never };

export function createHasuraSyncSetupFromFragment<T, Constraints extends EntityConstraints = {}>(
  fragment: DocumentNode,
  options: (
    | InsertOnlyOptions<Constraints>
    | UpdateOnlyOptions<Constraints>
    | UpsertOptions<Constraints>
    | ReadOnlyOptions
  ) & {
    teamScopeCondition?: Constraints["where"] extends object ? (teamId: string) => Constraints["where"] : never;
  } = {}
): EntitySyncConfig<T> {
  const { name, type, keys } = analyzeFragment<T>(fragment);

  const upperType = upperFirst(type);

  /**
   * Provide array of ids you want to check if you have access to. Will return list of items you dont have access to.
   *
   * Note: this method is batched, so one request per list is needed.
   */
  async function getLostAccessIds(idsToCheck: string[], apollo: ApolloClient<unknown>): Promise<string[] | null> {
    const result = await apollo.query<{ itemsWithAccess: Array<{ id: string }> }, { ids: string[] }>({
      variables: { ids: idsToCheck },
      fetchPolicy: "no-cache",
      query: gqlTag`
      query Check${upperType}Access($ids: [uuid!]!) {
        itemsWithAccess: ${type}(where: {id: {_in: $ids}}) {
          id
        }
      }
  `,
    });

    if (!result.data) {
      return null;
    }

    const idsWithoutAccess = new Set(idsToCheck);

    result.data.itemsWithAccess.forEach((itemWithAccess) => {
      idsWithoutAccess.delete(itemWithAccess.id);
    });

    return Array.from(idsWithoutAccess);
  }

  function getPushInputFromData(data: T, { isUpdate } = { isUpdate: false }) {
    return runUntracked(() => {
      const columns = isUpdate
        ? "updateColumns" in options && options.updateColumns
        : "insertColumns" in options && options.insertColumns;
      // If we have specified columns - use those
      if (columns) {
        return pick(data, columns);
      }

      // Otherwise, pass all keys of data we have.
      return pick(data, keys);
    });
  }

  function fixLastUpdateDateForHasura(date: Date) {
    /**
     * Hasura has more precision in dates than it is possible with javascript. eg
     * JS date of
     * 8:30:00.234 in hasura can be 8:30:00.2348
     *
     * It means hasura data is 'a bit' bigger and we need to account for that when using updated_at queries.
     * If we did not, we'd have infinite loop of syncing the same item as it would always have bigger updated_at than last sync.
     */
    return new Date(date.getTime() + 1);
  }

  async function upsert(input: Partial<T>, apollo: ApolloClient<unknown>) {
    const upsertConstraint = "upsertConstraint" in options ? options.upsertConstraint : null;
    assert(upsertConstraint && "updateColumns" in options, `${type} of entity has no upsert constraint defined`);
    return await apollo.mutate<{ result: T }, { input: Partial<T>; updateColumns: Array<keyof T>; constraint: string }>(
      {
        variables: {
          input,
          updateColumns: options.updateColumns as Array<string> as Array<keyof T>,
          constraint: upsertConstraint,
        },
        mutation: gqlTag`
        ${fragment}
        mutation PushUpdate${upperType}(
          $input: ${type}_insert_input!
          $updateColumns: [${type}_update_column!]! 
          $constraint: ${type}_constraint!
        ) {
          result: insert_${type}_one(
            object: $input
            on_conflict: {
              constraint: $constraint
              update_columns: $updateColumns
            }
          ) {
            ...${name}
          }
        }
      `,
      }
    );
  }

  async function insert(input: Partial<T>, apollo: ApolloClient<unknown>) {
    return await apollo.mutate<{ result: T }, { input: Partial<T> }>({
      variables: { input },
      mutation: gqlTag`
      ${fragment}
      mutation PushUpsert${upperType}(
        $input: ${type}_insert_input!
      ) {
        result: insert_${type}_one(
          object: $input
        ) {
          ...${name}
        }
      }
    `,
    });
  }

  async function update(idPointer: Record<string, string>, input: Partial<T>, apollo: ApolloClient<unknown>) {
    return await apollo.mutate<{ result: T }, { pk: Record<string, string>; input: Partial<T> }>({
      variables: { input, pk: idPointer },
      mutation: gqlTag`
      ${fragment}
      mutation PushUpdate${upperType}($pk: ${type}_pk_columns_input!, $input: ${type}_set_input!) {
        result: update_${type}_by_pk(pk_columns: $pk, _set: $input) {
          ...${name}
        }
      }
    `,
    });
  }

  async function handlePush(entity: Entity<T, unknown>, changedData: Partial<T>, apollo: ApolloClient<unknown>) {
    const hasUpdateColumns = ("updateColumns" in options && options.updateColumns?.length) ?? 0 > 0;

    const hasInsertColumns = ("insertColumns" in options && options.insertColumns?.length) ?? 0 > 0;

    let input = getPushInputFromData({ ...entity.getData(), ...changedData });

    if (hasUpdateColumns && hasInsertColumns) {
      return upsert(input, apollo);
    }

    if (hasInsertColumns) {
      return insert(input, apollo);
    }

    input = getPushInputFromData({ ...entity.getData(), ...changedData }, { isUpdate: true });

    const id = entity.getKey();
    const idKey = entity.getKeyName();

    return update({ [idKey]: id }, input, apollo);
  }

  return {
    pullUpdated({ lastSyncDate, updateItems, getContextValue, isFirstSync }) {
      const apollo = getContextValue(apolloContext);
      const teamId = getContextValue(teamIdContext);

      function getTeamScopeWhere() {
        if (!teamId) return {};

        return options.teamScopeCondition?.(teamId) ?? {};
      }

      /**
       * For first sync use query instead of subscription. Subscription is kinda race-condition with luck.
       * Hasura performs subscription check every 1s, so we might get response in 0 to 1s + query time itself.
       *
       * Also, subscription includes 2 roundtrips of networking.
       *
       * TLDR: in practice it resulted in 2-3x faster response.
       *
       * Note: instantly after initial query based fetch, we inform clientdb so it'll request next sync, and this time we'll normally use subscription to actually watch for changes
       */
      if (isFirstSync) {
        apollo
          .query<{ updates: T[] }, { where: Record<string, unknown> }>({
            fetchPolicy: "no-cache",
            variables: {
              where: {
                updated_at: { _gt: fixLastUpdateDateForHasura(lastSyncDate) },
                ...getTeamScopeWhere(),
              },
            },
            query: gqlTag`
            ${fragment}
            query FirstPull${upperType}Updates($where: ${type}_bool_exp!) {
              updates: ${type}(where: $where) {
                ...${name}
              }
            }
          `,
          })
          .then((result) => {
            const updatedItems = result.data?.updates ?? [];

            updateItems(updatedItems, true);
          });

        return;
      }

      const observer = apollo.subscribe<{ updates: T[] }, { where: Record<string, unknown> }>({
        variables: {
          where: {
            updated_at: { _gt: fixLastUpdateDateForHasura(lastSyncDate) },
            ...getTeamScopeWhere(),
          },
        },
        query: gqlTag`
        ${fragment}
        subscription Pull${upperType}Updates($where: ${type}_bool_exp!) {
          updates: ${type}(where: $where) {
            ...${name}
          }
        }
      `,
      });

      const subscription = observer.subscribe((nextResult) => {
        const updatedItems = nextResult.data?.updates ?? [];

        updateItems(updatedItems);
      });

      return () => {
        subscription.unsubscribe();
      };
    },
    async push(entity, changedData, { getContextValue }) {
      const apollo = getContextValue(apolloContext);

      const result = await handlePush(entity, changedData, apollo);

      if (result.errors) {
        throw result.errors;
      }

      return result.data?.result ?? false;
    },
    async remove(entity, { getContextValue }) {
      const apollo = getContextValue(apolloContext);
      const id = entity.getKey();
      const keyField = entity.getKeyName();
      const result = await apollo.mutate<
        { deleteResult: { removedItems: T[] } },
        { where: Record<string, { _eq: string }> }
      >({
        variables: { where: { [keyField]: { _eq: id } } },
        mutation: gqlTag`
        ${fragment}
        mutation PushDelete${upperType}($where: ${type}_bool_exp!) {
          deleteResult: delete_${type}(where: $where) {
            removedItems: returning {
              ...${name}
            }
          }
        }
      `,
      });

      return !!result.data?.deleteResult.removedItems.length ?? 0 > 0;
    },
    pullRemoves({ getContextValue, lastSyncDate, removeItems }) {
      const apollo = getContextValue(apolloContext);
      const teamId = getContextValue(teamIdContext);

      if (!teamId) {
        return;
      }

      const observer = apollo.subscribe<PullSyncRequestsSubscription, PullSyncRequestsSubscriptionVariables>({
        query: pullSyncRequestsSubscription,
        variables: {
          lastSyncDate: fixLastUpdateDateForHasura(lastSyncDate).toISOString(),
          entityName: type,
          teamId,
        },
      });

      const subscription = observer.subscribe(async (nextResult) => {
        const syncRequests = nextResult.data?.sync_request ?? [];

        const idsToRemove: string[] = [];
        const idsToCheckAccess: string[] = [];

        const lastSyncRequestDate = max(syncRequests.map((request) => new Date(request.date)));

        syncRequests.forEach((syncRequest) => {
          if (syncRequest.change_type === "delete") {
            idsToRemove.push(syncRequest.entity_id);
          }

          if (syncRequest.change_type === "update") {
            idsToCheckAccess.push(syncRequest.entity_id);
          }
        });

        if (idsToCheckAccess.length !== 0) {
          idsToRemove.push(...((await getLostAccessIds(idsToCheckAccess, apollo)) ?? []));
        }

        removeItems(idsToRemove, lastSyncRequestDate);
      });

      return () => {
        subscription.unsubscribe();
      };
    },
  };
}
