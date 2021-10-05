import { ApolloClient } from "@apollo/client";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { max, pick } from "lodash";

import { EntitySyncConfig } from "~clientdb";
import {
  Attachment_Constraint,
  Message_Constraint,
  Message_Reaction_Constraint,
  PullSyncRequestsSubscription,
  PullSyncRequestsSubscriptionVariables,
  Task_Constraint,
  Team_Constraint,
  Team_Invitation_Constraint,
  Team_Member_Constraint,
  Topic_Constraint,
  User_Constraint,
} from "~gql";
import { assert } from "~shared/assert";

import { analyzeFragment } from "./analyzeFragment";
import { apolloContext, teamIdContext } from "./context";

/**
 * This module sets up entire sync layer for hasura.
 *
 * Hasura api is 'predictable' so it is possible to 'generate' all graphql queries at runtime basing on 'mostly' only
 * the fragment of data
 *
 * the only additional data needed is insert and update columns as those might be restricted by permissions
 */

/**
 * In order to handle upserts (insert or update) we need to provide 'conflict' key. Usually it is primary key name.
 *
 * In hasura those names stay the same even if you eg. rename the table, so we have to provide them manually.
 */
type ConstraintsTypeMap = {
  task: Task_Constraint;
  topic: Topic_Constraint;
  user: User_Constraint;
  team: Team_Constraint;
  team_member: Team_Member_Constraint;
  team_invitation: Team_Invitation_Constraint;
  message: Message_Constraint;
  message_reaction: Message_Reaction_Constraint;
  attachment: Attachment_Constraint;
};

type ConstraintsValueMap = {
  [key in keyof ConstraintsTypeMap]: ConstraintsTypeMap[key];
};

const upsertConstraints: ConstraintsValueMap = {
  task: "task_pkey",
  topic: "thread_pkey",
  user: "user_pkey",
  team: "team_id_key",
  team_member: "team_member_id_key",
  team_invitation: "team_invitation_pkey",
  message: "message_id_key",
  message_reaction: "message_reaction_id_key",
  attachment: "attachment_id_key",
};

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

interface HasuraSyncSettings<T> {
  updateColumns: Array<keyof T>;
  insertColumns?: Array<keyof T>;
}

function getFirstUpper(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function createHasuraSyncSetupFromFragment<T>(
  fragment: DocumentNode,
  { updateColumns, insertColumns }: HasuraSyncSettings<T>
): EntitySyncConfig<T> {
  const { name, type, keys } = analyzeFragment<T>(fragment);

  const upsertConstraint = upsertConstraints[type as keyof ConstraintsTypeMap];

  assert(upsertConstraint, `${type} of entity has no upsert constraint defined`);

  const upperType = getFirstUpper(type);

  /**
   * Provide array of ids you want to check if you have access to. Will return list of items you dont have access to.
   *
   * Note: this method is batched, so one request per list is needed.
   */
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
    // If we have specified input columns - use those
    if (insertColumns) {
      return pick(data, insertColumns);
    }

    // Otherwise, pass all keys of data we have.
    return pick(data, keys);
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

  return {
    pullUpdated({ lastSyncDate, updateItems, getContextValue }) {
      const apollo = getContextValue(apolloContext);

      const observer = apollo.subscribe<{ updates: T[] }, { lastSyncDate: Date }>({
        variables: { lastSyncDate: fixLastUpdateDateForHasura(lastSyncDate) },
        query: gqlTag`
        ${fragment}
        subscription Pull${upperType}Updates($lastSyncDate: timestamptz!) {
          updates: ${type}(where: { updated_at: { _gt: $lastSyncDate } }) {
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
      const hasUpdateColumns = updateColumns.length > 0;
      const result = await apollo.mutate<
        { result: T },
        { input: Partial<T>; updateColumns?: Array<keyof T>; constraint?: string }
      >({
        variables: hasUpdateColumns ? { input, updateColumns, constraint: upsertConstraint } : { input },
        mutation: gqlTag`
          ${fragment}
          mutation PushUpdate${upperType}(
            $input: ${type}_insert_input!
            ${
              hasUpdateColumns
                ? ` 
            $updateColumns: [${type}_update_column!]! 
            $constraint: ${type}_constraint!
            `
                : ""
            }
          ) {
            result: insert_${type}_one(
              object: $input
              ${
                hasUpdateColumns
                  ? `
              on_conflict: {
                constraint: $constraint
                update_columns: $updateColumns
              }`
                  : ""
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
