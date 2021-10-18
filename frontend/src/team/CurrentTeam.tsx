import { gql, useApolloClient } from "@apollo/client";
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  ChangeCurrentTeamIdMutation,
  ChangeCurrentTeamIdMutationVariables,
  CurrentTeamSubscription,
  CurrentTeamSubscriptionVariables,
} from "~frontend/../../gql";
import { assert } from "~frontend/../../shared/assert";
import { createChannel } from "~frontend/../../shared/channel";
import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useNullableDb } from "~frontend/clientdb";

function useCurrentTeamManager() {
  const apollo = useApolloClient();
  const userToken = useCurrentUserTokenData();
  const [isLoading, setIsLoading] = useState(true);
  const channel = useMemo(() => {
    return createChannel<string | null>();
  }, [apollo, userToken]);

  useEffect(() => {
    if (!userToken) return;
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
        channel.publish(newTeamId);
        setIsLoading(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [channel, apollo, userToken]);

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
      return;
    }

    channel.publish(newTeamId);
  }

  const teamId = channel.useLastValue();

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
  const { teamId } = useCurrentTeamManager();

  const team = teamId ? db?.team.findById(teamId) ?? null : null;

  return team;
}

export function useAssertCurrentTeam() {
  const team = useCurrentTeam();

  assert(team, "No team inside useAssertCurrentTeam");

  return team;
}
