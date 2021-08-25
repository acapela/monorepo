import { gql, useSubscription } from "@apollo/client";
import { PropsWithChildren } from "react";

import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { CurrentTeamSubscription, CurrentTeamSubscriptionVariables } from "~gql";

import { CurrentTeamIdContext } from "./CurrentTeamIdContext";

/*
We can't always rely on the current_team_id from the session because when a user changes the team, the session doesn't refresh.
Instead, we take the current_team_id from the session on the server-side, and on the page load, we create a subscription.
*/
export function CurrentTeamIdProvider({ children }: PropsWithChildren<{}>) {
  const user = useCurrentUser();
  const { data } = useSubscription<CurrentTeamSubscription, CurrentTeamSubscriptionVariables>(
    gql`
      subscription CurrentTeam($userId: uuid!) {
        user: user_by_pk(id: $userId) {
          current_team_id
        }
      }
    `,
    user ? { variables: { userId: user.id } } : { skip: true }
  );

  return (
    <CurrentTeamIdContext.Provider value={data?.user?.current_team_id ?? user?.currentTeamId ?? null}>
      {children}
    </CurrentTeamIdContext.Provider>
  );
}
