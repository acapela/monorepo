import { ApolloClient } from "@apollo/client";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { max, pick } from "lodash";

import { EntitySyncConfig } from "~clientdb";
import {
  Attachment_Bool_Exp,
  Attachment_Constraint,
  Attachment_Insert_Input,
  Attachment_Update_Column,
  Last_Seen_Message_Bool_Exp,
  Last_Seen_Message_Constraint,
  Last_Seen_Message_Insert_Input,
  Last_Seen_Message_Update_Column,
  Message_Bool_Exp,
  Message_Constraint,
  Message_Insert_Input,
  Message_Reaction_Bool_Exp,
  Message_Reaction_Constraint,
  Message_Reaction_Insert_Input,
  Message_Reaction_Update_Column,
  Message_Update_Column,
  PullSyncRequestsSubscription,
  PullSyncRequestsSubscriptionVariables,
  Task_Bool_Exp,
  Task_Constraint,
  Task_Insert_Input,
  Task_Update_Column,
  Team_Bool_Exp,
  Team_Constraint,
  Team_Insert_Input,
  Team_Member_Bool_Exp,
  Team_Member_Constraint,
  Team_Member_Insert_Input,
  Team_Member_Slack_Bool_Exp,
  Team_Member_Update_Column,
  Team_Update_Column,
  Topic_Bool_Exp,
  Topic_Constraint,
  Topic_Insert_Input,
  Topic_Update_Column,
  Transcription_Bool_Exp,
  User_Bool_Exp,
} from "~gql";
import { assert } from "~shared/assert";
import { runUntracked } from "~shared/mobxUtils";

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
  team: Team_Constraint;
  team_member: Team_Member_Constraint;
  message: Message_Constraint;
  message_reaction: Message_Reaction_Constraint;
  attachment: Attachment_Constraint;
  last_seen_message: Last_Seen_Message_Constraint;
};

type ConstraintsValueMap = {
  [key in keyof ConstraintsTypeMap]: ConstraintsTypeMap[key];
};

const upsertConstraints: ConstraintsValueMap = {
  task: "task_pkey",
  topic: "thread_pkey",
  team: "team_id_key",
  team_member: "team_member_id_key",
  message: "message_id_key",
  message_reaction: "message_reaction_id_key",
  attachment: "attachment_id_key",
  last_seen_message: "last_seen_message_pkey",
};

type InsertTypeMap = {
  task: Task_Insert_Input;
  topic: Topic_Insert_Input;
  team: Team_Insert_Input;
  team_member: Team_Member_Insert_Input;
  message: Message_Insert_Input;
  message_reaction: Message_Reaction_Insert_Input;
  attachment: Attachment_Insert_Input;
  last_seen_message: Last_Seen_Message_Insert_Input;
};

type UpdateTypeMap = {
  task: Task_Update_Column;
  topic: Topic_Update_Column;
  team: Team_Update_Column;
  team_member: Team_Member_Update_Column;
  message: Message_Update_Column;
  message_reaction: Message_Reaction_Update_Column;
  attachment: Attachment_Update_Column;
  last_seen_message: Last_Seen_Message_Update_Column;
};

type WhereTypeMap = {
  task: Task_Bool_Exp;
  topic: Topic_Bool_Exp;
  team: Team_Bool_Exp;
  team_member: Team_Member_Bool_Exp;
  message: Message_Bool_Exp;
  message_reaction: Message_Reaction_Bool_Exp;
  attachment: Attachment_Bool_Exp;
  last_seen_message: Last_Seen_Message_Bool_Exp;
  user: User_Bool_Exp;
  transcription: Transcription_Bool_Exp;
  team_member_slack: Team_Member_Slack_Bool_Exp;
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

type FragmentEntityType<T> = T extends { __typename: infer S } ? S : never;

type UpdateColumnsForFragment<T> = FragmentEntityType<T> extends keyof UpdateTypeMap
  ? UpdateTypeMap[FragmentEntityType<T>]
  : never;

type InsertColumnsForFragment<T> = FragmentEntityType<T> extends keyof InsertTypeMap
  ? keyof InsertTypeMap[FragmentEntityType<T>]
  : never;

type AdditionalWhereQueryForFragment<T> = FragmentEntityType<T> extends keyof WhereTypeMap
  ? WhereTypeMap[FragmentEntityType<T>]
  : never;

interface HasuraSyncSettings<T> {
  updateColumns: Array<UpdateColumnsForFragment<T>>;
  insertColumns?: Array<InsertColumnsForFragment<T>>;
  teamScopeCondition?: (teamId: string) => AdditionalWhereQueryForFragment<T>;
}

function getFirstUpper(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function createHasuraSyncSetupFromFragment<T>(
  fragment: DocumentNode,
  { updateColumns, insertColumns, teamScopeCondition }: HasuraSyncSettings<T>
): EntitySyncConfig<T> {
  const { name, type, keys } = analyzeFragment<T>(fragment);

  const upperType = getFirstUpper(type);

  const upsertConstraint = upsertConstraints[type as keyof ConstraintsTypeMap];

  // Throw early in case of incorrect input
  if (updateColumns.length) {
    assert(upsertConstraint, `${type} of entity has no upsert constraint defined which is required for updates`);
  }

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
    return runUntracked(() => {
      // If we have specified input columns - use those
      if (insertColumns) {
        return pick(data, insertColumns);
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
    assert(upsertConstraint, `${type} of entity has no upsert constraint defined`);
    return await apollo.mutate<{ result: T }, { input: Partial<T>; updateColumns: Array<keyof T>; constraint: string }>(
      {
        variables: {
          input,
          updateColumns: updateColumns as Array<string> as Array<keyof T>,
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
        mutation PushUpdate${upperType}(
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

  async function insertOrUpsert(input: Partial<T>, apollo: ApolloClient<unknown>) {
    const hasUpdateColumns = updateColumns.length > 0;

    if (!hasUpdateColumns) {
      return insert(input, apollo);
    }

    return upsert(input, apollo);
  }

  return {
    pullUpdated({ lastSyncDate, updateItems, getContextValue }) {
      const apollo = getContextValue(apolloContext);
      const teamId = getContextValue(teamIdContext);

      function getTeamScopeWhere() {
        if (!teamId) return {};

        return teamScopeCondition?.(teamId) ?? {};
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
    async push(entity, { getContextValue }) {
      const apollo = getContextValue(apolloContext);
      const input = getPushInputFromData(entity);

      const result = await insertOrUpsert(input, apollo);

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
