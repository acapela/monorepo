import { ApolloClient, gql, useApolloClient } from "@apollo/client";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useNullableDb } from "~frontend/clientdb";
import { knownErrors } from "~frontend/errors/knownErrors";
import {
  ChangeCurrentTeamIdMutation,
  ChangeCurrentTeamIdMutationVariables,
  CurrentTeamSubscription,
  CurrentTeamSubscriptionVariables,
} from "~gql";
import { assert } from "~shared/assert";
import { useAsyncEffect } from "~shared/hooks/useAsyncEffect";

async function fetchCurrentTeamId(apollo: ApolloClient<unknown>, userId: string) {
  const result = await apollo.query<CurrentTeamSubscription, CurrentTeamSubscriptionVariables>({
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

async function subscribeToCurrentTeamId(
  apollo: ApolloClient<unknown>,
  userId: string,
  onTeamId: (teamId: string | null) => void
) {
  const subscription = apollo
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

function useCurrentTeamManager() {
  const apollo = useApolloClient();
  const userToken = useCurrentUserTokenData();
  const [isLoading, setIsLoading] = useState(true);
  const [teamId, setCurrentTeamId] = useState<null | string>(null);

  const userId = userToken?.id;

  function handleHasTeamId(teamId: string | null) {
    unstable_batchedUpdates(() => {
      setCurrentTeamId(teamId);
      setIsLoading(false);
    });
  }

  useAsyncEffect(
    async ({ getIsCancelled }) => {
      setCurrentTeamId(null);

      if (!userId) return;

      // First use query instead of subscription as it is ~50% faster to get initial response than subscription.

      const initialTeamId = await fetchCurrentTeamId(apollo, userId);

      if (getIsCancelled()) return;

      // Use team id from fetching
      handleHasTeamId(initialTeamId);

      // Now, after initial data is fetched using query - go to subscription to actually listen for changes
      return subscribeToCurrentTeamId(apollo, userId, handleHasTeamId);
    },
    [apollo, userId]
  );

  async function changeTeamId(newTeamId: string) {
    if (!userToken) return;

    const result = await apollo.mutate<ChangeCurrentTeamIdMutation, ChangeCurrentTeamIdMutationVariables>({
      variables: { userId: userToken.id, teamId: newTeamId },
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

    setCurrentTeamId(newTeamId);
  }

  return {
    teamId,
    changeTeamId,
    isLoading,
  };
}

export type CurrentTeamContextData = ReturnType<typeof useCurrentTeamManager>;

const Context = createContext<CurrentTeamContextData | null>(null);

export function useCurrentTeamContext() {
  const contextValue = useContext(Context);

  assert(contextValue, "useCurrentTeamContext can only be used inside CurrentTeamProvider");

  return contextValue;
}

export function CurrentTeamProvider({ children }: PropsWithChildren<{}>) {
  const teamManager = useCurrentTeamManager();

  return <Context.Provider value={teamManager}>{children}</Context.Provider>;
}

export function useCurrentTeam() {
  const db = useNullableDb();
  const { teamId } = useCurrentTeamContext();

  const team = teamId ? db?.team.findById(teamId) ?? null : null;

  return team;
}

export function useAssertCurrentTeam() {
  const team = useCurrentTeam();

  assert(team, knownErrors.removedFromCurrentTeam);

  return team;
}
