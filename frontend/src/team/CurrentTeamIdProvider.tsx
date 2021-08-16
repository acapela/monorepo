import { PropsWithChildren, useEffect, useState } from "react";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { userDetailedInfoQuery } from "~frontend/gql/user";
import { CurrentTeamIdContext } from "./CurrentTeamIdContext";

/*
We can't always rely on the current_team_id from the session because when a user changes the team, the session doesn't refresh.
Instead, we take the current_team_id from the session on the server-side, and on the page load, we create a subscription.
*/
export function CurrentTeamIdProvider({ children }: PropsWithChildren<{}>) {
  const user = useCurrentUser();

  const [teamId, setTeamId] = useState(user?.currentTeamId ?? null);

  useEffect(() => {
    if (!user) return;

    return userDetailedInfoQuery.subscribe({ id: user.id }, (newUserInfo) => {
      setTeamId(newUserInfo.user_by_pk?.current_team?.id ?? null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return <CurrentTeamIdContext.Provider value={teamId}>{children}</CurrentTeamIdContext.Provider>;
}
