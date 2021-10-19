import { gql, useApolloClient } from "@apollo/client";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useNullableDb } from "~frontend/clientdb";
import {
  ChangeCurrentTeamIdMutation,
  ChangeCurrentTeamIdMutationVariables,
  CurrentTeamSubscription,
  CurrentTeamSubscriptionVariables,
} from "~gql";
import { assert } from "~shared/assert";

function useCurrentTeamManager() {
  const apollo = useApolloClient();
  const userToken = useCurrentUserTokenData();
  const [isLoading, setIsLoading] = useState(true);
  const [teamId, setCurrentTeamId] = useState<null | string>(null);

  useEffect(() => {
    setCurrentTeamId(null);
    if (!userToken?.id) return;
    const subscription = apollo
      .subscribe<CurrentTeamSubscription, CurrentTeamSubscriptionVariables>({
        variables: {
          userId: userToken.id,
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

        unstable_batchedUpdates(() => {
          setCurrentTeamId(newTeamId);
          setIsLoading(false);
        });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [apollo, userToken?.id]);

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

  assert(team, "No team inside useAssertCurrentTeam");

  return team;
}
