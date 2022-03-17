import { gql } from "@apollo/client";

import { apolloClient } from "@aca/desktop/apolloClient";
import {
  DesktopChangeCurrentTeamIdMutation,
  DesktopChangeCurrentTeamIdMutationVariables,
  DesktopCurrentTeamInitialQuery,
  DesktopCurrentTeamInitialQueryVariables,
  DesktopCurrentTeamSubscription,
  DesktopCurrentTeamSubscriptionVariables,
} from "@aca/gql";

/**
 * Set of authStore utils for managing and keeping team info in sync
 */

async function fetchCurrentTeamId(userId: string) {
  const result = await apolloClient.query<DesktopCurrentTeamInitialQuery, DesktopCurrentTeamInitialQueryVariables>({
    variables: {
      userId,
    },
    fetchPolicy: "no-cache",
    query: gql`
      query DesktopCurrentTeamInitial($userId: uuid!) {
        user: user_by_pk(id: $userId) {
          current_team {
            id
          }
        }
      }
    `,
  });

  if (result.error) {
    throw result.error;
  }

  return result.data.user?.current_team?.id ?? null;
}

function subscribeToCurrentTeamId(userId: string, onTeamId: (teamId: string | null) => void) {
  const subscription = apolloClient
    .subscribe<DesktopCurrentTeamSubscription, DesktopCurrentTeamSubscriptionVariables>({
      variables: {
        userId,
      },
      query: gql`
        subscription DesktopCurrentTeam($userId: uuid!) {
          user: user_by_pk(id: $userId) {
            current_team {
              id
            }
          }
        }
      `,
    })
    .subscribe((newResult) => {
      if (!newResult.data) return;
      const newTeamId = newResult.data.user?.current_team?.id ?? null;

      onTeamId(newTeamId);
    });

  return () => {
    subscription.unsubscribe();
  };
}

export async function changeTeamId(userId: string, newTeamId: string) {
  const result = await apolloClient.mutate<
    DesktopChangeCurrentTeamIdMutation,
    DesktopChangeCurrentTeamIdMutationVariables
  >({
    variables: { userId, teamId: newTeamId },
    mutation: gql`
      mutation DesktopChangeCurrentTeamId($userId: uuid!, $teamId: uuid) {
        update_user_by_pk(pk_columns: { id: $userId }, _set: { current_team_id: $teamId }) {
          id
        }
      }
    `,
  });

  if (result.errors) {
    throw new Error(`Failed to change team id`);
  }
}

export function watchUserTeamId(userId: string, onTeamId: (teamId: string | null) => void) {
  let isCancelled = false;

  let stopSubscription: () => void;

  async function run() {
    try {
      const initialTeamId = await fetchCurrentTeamId(userId);
      onTeamId(initialTeamId);
    } catch (error) {
      console.error(`Failed to get initial team`, error);
    }

    if (isCancelled) return;

    stopSubscription = subscribeToCurrentTeamId(userId, (teamId) => {
      if (isCancelled) return;

      onTeamId(teamId);
    });
  }

  run();

  return function cancel() {
    isCancelled = true;
    if (stopSubscription) stopSubscription();
  };
}
