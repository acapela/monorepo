import { gql } from "@apollo/client";

import { apolloClient } from "@aca/desktop/apolloClient";
import {
  ChangeCurrentTeamIdMutation,
  ChangeCurrentTeamIdMutationVariables,
  CurrentTeamSubscription,
  CurrentTeamSubscriptionVariables,
} from "@aca/gql";

/**
 * Set of authStore utils for managing and keeping team info in sync
 */

async function fetchCurrentTeamId(userId: string) {
  const result = await apolloClient.query<CurrentTeamSubscription, CurrentTeamSubscriptionVariables>({
    variables: {
      userId,
    },
    fetchPolicy: "no-cache",
    query: gql`
      query CurrentTeamInitial($userId: uuid!) {
        user: user_by_pk(id: $userId) {
          current_team {
            id
          }
        }
      }
    `,
  });

  if (result.error) return null;

  return result.data.user?.current_team?.id ?? null;
}

function subscribeToCurrentTeamId(userId: string, onTeamId: (teamId: string | null) => void) {
  const subscription = apolloClient
    .subscribe<CurrentTeamSubscription, CurrentTeamSubscriptionVariables>({
      variables: {
        userId,
      },
      query: gql`
        subscription CurrentTeam($userId: uuid!) {
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
  const result = await apolloClient.mutate<ChangeCurrentTeamIdMutation, ChangeCurrentTeamIdMutationVariables>({
    variables: { userId, teamId: newTeamId },
    mutation: gql`
      mutation ChangeCurrentTeamId($userId: uuid!, $teamId: uuid) {
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
    const initialTeamId = await fetchCurrentTeamId(userId);

    if (isCancelled) return;

    onTeamId(initialTeamId);

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
