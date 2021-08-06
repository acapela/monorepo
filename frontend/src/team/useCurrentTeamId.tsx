import { assertDefined } from "~shared/assert";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useUserDetailedInfoQuery, userDetailedInfoQuery } from "~frontend/gql/user";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

const useCurrentTeamIdQuery = (): string | null => {
  const user = useCurrentUser();
  const teamIdFromJWT = user?.currentTeamId;

  const [teamId, setTeamId] = useState(teamIdFromJWT ?? null);

  useEffect(() => {
    if (!user) return;

    userDetailedInfoQuery.subscribe({ id: user.id }, (newUserInfo) => {
      setTeamId(newUserInfo.user_by_pk?.current_team?.id ?? null);
    });
  }, [user?.id]);

  return teamId;
};

const TeamIdContext = createContext<string | null>(null);

export function TeamProvider({ children }: PropsWithChildren<{}>) {
  const teamId = useCurrentTeamIdQuery();

  return <TeamIdContext.Provider value={teamId}>{children}</TeamIdContext.Provider>;
}

export function useCurrentTeamId() {
  return useContext(TeamIdContext);
}

export function useAssertCurrentTeamId(): string {
  const currentTeamId = useCurrentTeamId();

  return assertDefined(currentTeamId, "No team id");
}
