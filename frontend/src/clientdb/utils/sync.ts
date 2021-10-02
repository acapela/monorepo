import { ApolloClient } from "@apollo/client";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { max, pick } from "lodash";

import { EntitySyncConfig } from "~clientdb/entity/sync";
import { PullSyncRequestsSubscription, PullSyncRequestsSubscriptionVariables } from "~gql";

import { apolloContext, teamIdContext } from "../context";
import { analyzeFragment } from "./analyzeFragment";

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

interface HasuraSyncSettings<T> {
  upsertIdKey?: string;
  updateColumns: Array<keyof T>;
  insertColumns?: Array<keyof T>;
}

function getFirstUpper(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function createHasuraSyncSetupFromFragment<T>(
  fragment: DocumentNode,
  { upsertIdKey, updateColumns, insertColumns }: HasuraSyncSettings<T>
): EntitySyncConfig<T> {
  const { name, type, keys } = analyzeFragment<T>(fragment);

  const finalInsertPrimaryKey = upsertIdKey ?? `${type}_pkey`;

  const upperType = getFirstUpper(type);

  async function getLostAccessIds(idsToCheck: string[], apollo: ApolloClient<unknown>): Promise<string[] | null> {
    const result = await apollo.query<{ itemsWithAccess: Array<{ id: string }> }, { ids: string[] }>({
      variables: { ids: idsToCheck },
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

  function getPushInputFromData(data: T) {
    if (insertColumns) {
      return pick(data, insertColumns);
    }

    return pick(data, keys);
  }

  return {
    pullUpdated({ lastSyncDate, updateItems, getContextValue }) {
      const apollo = getContextValue(apolloContext);

      const observer = apollo.subscribe<{ updates: T[] }>({
        query: gqlTag`
        ${fragment}
        subscription Pull${upperType}Updates {
          updates: ${type}(where: { updated_at: { _gt: "${lastSyncDate.toISOString()}" } }) {
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
    async push(entity, { getContextValue }) {
      const apollo = getContextValue(apolloContext);
      const input = getPushInputFromData(entity);
      const result = await apollo.mutate<{ result: T }, { input: Partial<T> }>({
        variables: { input },
        mutation: gqlTag`
          ${fragment}
          mutation PushUpdate${upperType}($input: ${type}_insert_input!) {
            result: insert_${type}_one(
              object: $input
              on_conflict: {
                constraint: ${finalInsertPrimaryKey}
                update_columns: [${updateColumns.join(", ")}]
              }
            ) {
              ...${name}
            }
          }
        `,
      });

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
          lastSyncDate: lastSyncDate.toISOString(),
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

        const itemsWithLostAccess = (await getLostAccessIds(idsToCheckAccess, apollo)) ?? [];

        const allItemsToRemove = [...idsToRemove, ...itemsWithLostAccess];

        removeItems(allItemsToRemove, lastSyncRequestDate);
      });

      return () => {
        subscription.unsubscribe();
      };
    },
  };
}
